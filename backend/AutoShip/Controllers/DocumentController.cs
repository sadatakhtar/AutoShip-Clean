using AutoShip.Data;
using AutoShip.DTOs;
using AutoShip.Models;
using AutoShip.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoShip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly ImportDbContext _context;
        private readonly BlobStorageService _blobStorage;

        public DocumentController(ImportDbContext context, BlobStorageService blobStorage)
        {
            _context = context;
            _blobStorage = blobStorage;
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

        // -------------------------
        // UPDATED UPLOAD ENDPOINT
        // -------------------------
        [Authorize]
        [HttpPost("{carId}")]
        public async Task<IActionResult> AddDocument(int carId, IFormFile file, [FromForm] DocumentDto dto)
        {
            var car = await _context.Cars.FindAsync(carId);
            if (car is null)
                return NotFound();

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // Upload to Azure Blob Storage
            var blobName = await _blobStorage.UploadAsync(file, car.VIN);

            var doc = new Documents
            {
                Type = dto.Type,
                FilePath = blobName, // store blob name, not URL
                ReceivedDate = dto.ReceivedDate,
                CarId = carId
            };

            _context.Documents.Add(doc);
            await _context.SaveChangesAsync();

            return Ok(doc);
        }

        [Authorize]
        [HttpPut("{docId}")]
        public async Task<IActionResult> UpdateDocument(int carId, int docId, DocumentDto dto)
        {
            var doc = await _context.Documents
                .FirstOrDefaultAsync(d => d.Id == docId && d.CarId == carId);

            if (doc == null)
                return NotFound();

            doc.Type = dto.Type;
            doc.ReceivedDate = dto.ReceivedDate;

            await _context.SaveChangesAsync();
            return Ok(doc);
        }

        // -------------------------
        // UPDATED DELETE ENDPOINT
        // -------------------------
        [Authorize]
        [HttpDelete("{docId}")]
        public async Task<IActionResult> DeleteDocumentById(int carId, int docId)
        {
            var doc = await _context.Documents
                .FirstOrDefaultAsync(d => d.Id == docId && d.CarId == carId);

            if (doc is null)
                return NotFound();

            // Delete blob from Azure
            if (!string.IsNullOrEmpty(doc.FilePath))
            {
                await _blobStorage.DeleteFileAsync(doc.FilePath);
            }

            _context.Documents.Remove(doc);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}