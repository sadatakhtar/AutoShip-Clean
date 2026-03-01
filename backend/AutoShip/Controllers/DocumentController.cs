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

        // ----------------------------------------------------
        // GET SINGLE DOCUMENT BY DOCUMENT ID
        // ----------------------------------------------------
        [Authorize]
        [HttpGet("{docId}")]
        public async Task<IActionResult> GetDocumentById(int docId)
        {
            var doc = await _context.Documents.FindAsync(docId);
            if (doc is null)
                return NotFound();

            return Ok(doc);
        }

        // ----------------------------------------------------
        // GET ALL DOCUMENTS FOR A CAR
        // ----------------------------------------------------
        [Authorize]
        [HttpGet("car/{carId}")]
        public async Task<IActionResult> GetDocumentsForCar(int carId)
        {
            var docs = await _context.Documents
                .Where(d => d.CarId == carId)
                .OrderByDescending(d => d.ReceivedDate)
                .ToListAsync();

            return Ok(docs);
        }

        // ----------------------------------------------------
        // UPLOAD DOCUMENT (ONE FILE PER REQUEST)
        // ----------------------------------------------------
        [Authorize]
        [HttpPost("{carId}")]
        public async Task<IActionResult> AddDocument(int carId, IFormFile file, [FromForm] DocumentDto dto)
        {
            var car = await _context.Cars.FindAsync(carId);
            if (car is null)
                return NotFound();

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var blobName = await _blobStorage.UploadAsync(file, car.VIN);

            var doc = new Documents
            {
                Type = dto.Type,
                FileName = file.FileName,
                FilePath = blobName,
                ReceivedDate = dto.ReceivedDate,
                CarId = carId
            };

            _context.Documents.Add(doc);
            await _context.SaveChangesAsync();

            return Ok(doc);
        }

        // ----------------------------------------------------
        // UPDATE DOCUMENT METADATA
        // ----------------------------------------------------
        [Authorize]
        [HttpPut("{carId}/{docId}")]
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

        // ----------------------------------------------------
        // DELETE DOCUMENT
        // ----------------------------------------------------
        [Authorize]
        [HttpDelete("{carId}/{docId}")]
        public async Task<IActionResult> DeleteDocumentById(int carId, int docId)
        {
            var doc = await _context.Documents
                .FirstOrDefaultAsync(d => d.Id == docId && d.CarId == carId);

            if (doc is null)
                return NotFound();

            if (!string.IsNullOrEmpty(doc.FilePath))
                await _blobStorage.DeleteFileAsync(doc.FilePath);

            _context.Documents.Remove(doc);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ----------------------------------------------------
        // DOWNLOAD DOCUMENT (RETURNS FULL BLOB URL)
        // ----------------------------------------------------
        [Authorize]
        [HttpGet("download/{docId}")]
        public async Task<IActionResult> DownloadDocument(int docId)
        {
            var doc = await _context.Documents.FindAsync(docId);
            if (doc is null)
                return NotFound();

            // Build full blob URL
            var url = _blobStorage.GetBlobUrl(doc.FilePath);

            return Ok(new { url });
        }
    }
}