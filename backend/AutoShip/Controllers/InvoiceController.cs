using AutoShip.Data;
using AutoShip.DTOs;
using AutoShip.Models;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AutoShip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly ImportDbContext _context;
        public InvoiceController(ImportDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvoiceById(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if(invoice is null)
                return NotFound("Invoice not found");
            return Ok(invoice);
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateInvoice(InvoiceCreatedDto dto)
        {
            var car = await _context.Cars.FindAsync(dto.CarId);
            if (car == null) return NotFound();

            var invoice = dto.Adapt<Invoice>();
            invoice.IssueDate = DateTime.UtcNow;
            invoice.InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMddHHmmss}";

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return Ok(invoice.Id);
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoiceById(int id, InvoiceUpdatedDto dto)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice is null)
                return NotFound();

            invoice.DueDate = dto.DueDate;
            invoice.ShippingCost = dto.ShippingCost;
            invoice.CustomsFee = dto.CustomsFee;
            invoice.RegistrationFee = dto.RegistrationFee;
            invoice.OtherCharges = dto.OtherCharges;
            invoice.IsPaid = dto.IsPaid;
            invoice.PaymentDate = dto.PaymentDate;
            invoice.PaymentMethod = dto.PaymentMethod;
            invoice.Notes = dto.Notes;
            await _context.SaveChangesAsync();
            return Ok();
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoiceById(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice is null)
                return NotFound("Invoice not found");
            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
