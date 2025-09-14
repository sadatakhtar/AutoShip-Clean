using AutoShip.Data;
using AutoShip.DTOs;
using AutoShip.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoShip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly ImportDbContext _context;

        public DocumentController(ImportDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDocumentById(int id)
        {
            var doc = await _context.Documents.FindAsync(id);
            if (doc is null)
                return NotFound();
            return Ok(doc);
        }

        [HttpPost]
        public async Task<IActionResult> AddDocument(int carId, DocumentDto dto)
        {
            var car = await _context.Cars.FindAsync(carId);
            if (car is null)
                return NotFound();

            var doc = new Documents
            {
                Type = dto.Type,
                FilePath = dto.FilePath,
                ReceivedDate = dto.ReceivedDate,
                CarId = carId,
            };

            _context.Documents.Add(doc);
            await _context.SaveChangesAsync();
            return Ok(doc);
        }
        [Authorize]
        [HttpPut("{docId}")]
        public async Task<IActionResult> UpdateDocument(int carId, int docId, DocumentDto dto)
        {
            var doc = await _context.Documents.FirstOrDefaultAsync(d => d.Id == docId && d.CarId == carId);
            if (doc == null) return NotFound();

            doc.Type = dto.Type;
            doc.FilePath = dto.FilePath;
            doc.ReceivedDate = dto.ReceivedDate;

            await _context.SaveChangesAsync();
            return Ok(doc);
        }
        [Authorize]
        [HttpDelete("{docId}")]
        public async Task<IActionResult> DeleteDocumentById(int carId, int docId)
        {
            var doc = await _context.Documents.FirstOrDefaultAsync(d => d.Id == docId && d.CarId == carId);
            if (doc is null)
                return NotFound();

            _context.Documents.Remove(doc);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
