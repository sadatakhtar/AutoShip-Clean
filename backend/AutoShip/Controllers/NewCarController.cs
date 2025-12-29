using AutoShip.Data;
using AutoShip.DTOs;
using AutoShip.Models;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata;
using System.Runtime.CompilerServices;

namespace AutoShip.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewCarController : Controller
    {
        private readonly ImportDbContext _context;
        public NewCarController(ImportDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromForm] CarCreateDto dto)
        {
            Console.WriteLine(">>> NEWCAR ENDPOINT HIT WITH UPLOAD <<<");

            var car = new Car
            {
                VIN = dto.VIN,
                Make = dto.Make,
                Model = dto.Model,
                ManufactureDate = dto.ManufactureDate,
                Status = dto.Status,
                IVAStatus = dto.IVAStatus,
                MOTStatus = dto.MOTStatus,
                V55Status = dto.V55Status
            };


          //  var car = dto.Adapt<Car>();
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            // Save Uploaded docs
            if(dto.Documents != null)
            {
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                foreach (var file in dto.Documents)
                {
                    var filePath = Path.Combine(uploadPath, file.FileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    _context.Documents.Add(new Documents
                    {
                        CarId = car.Id,
                        FileName = file.FileName,
                        FilePath = filePath,
                        ReceivedDate = DateTime.UtcNow,
                        Type = dto.DocumentType
                    });
                }
                await _context.SaveChangesAsync();
                Console.WriteLine("Saved docs: " + dto.Documents.Count);

            }

            return Ok(car.Id);
        }


    }
}
