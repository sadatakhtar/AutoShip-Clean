using AutoShip.Data;
using AutoShip.DTOs;
using AutoShip.Models;
using AutoShip.Services;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoShip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly ImportDbContext _context;
        private readonly BlobStorageService _blobStorage;


        public CarController(ImportDbContext context, BlobStorageService blobStorage)
        {
            _context = context;
            _blobStorage = blobStorage;
        }

        // Add methods for CRUD operations here
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<Car>> GetAllCars()
        {
            var cars = await _context.Cars.ToListAsync();
            var dtos = cars.Adapt<List<CarDto>>();
            return Ok(dtos);

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCarById(int id)
        {
           // var car =  _context.Cars.FirstOrDefault(c => c.Id == id);
           var car = await _context.Cars
                .Include(c => c.Documents)
                .Include(c => c.Clearance)
                .Include(c => c.Registration)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (car is null)
                return NotFound();

            var dto = car.Adapt<CarDto>();
            return Ok(dto);
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Car>> AddCar([FromBody] CarCreateDto dto)
        {
            Console.WriteLine(">>> AddCar METHOD HIT <<<");
            Console.WriteLine("DTO VIN: " + dto.VIN);
            Console.WriteLine("DTO STATUS: " + dto.Status);
            Console.WriteLine("CCCCCCC", dto);

            var car = dto.Adapt<Car>();
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();
            return Ok(car.Id);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<Car>> UpdateCar(int id, Car updatedCar)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car is null)
                return NotFound();

            car.Make = updatedCar.Make;
            car.VIN = updatedCar.VIN;
            car.Model = updatedCar.Model;
            car.Status = updatedCar.Status;
            car.Documents = updatedCar.Documents;
            car.MOTStatus = updatedCar.MOTStatus;
            car.V55Status = updatedCar.V55Status;
            car.IVAStatus = updatedCar.IVAStatus;

            _context.Cars.Update(car);
            await _context.SaveChangesAsync();
            return NoContent();
        }

         [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Car>> DeleteCar(int id)
        {
            var car = await _context.Cars
                .Include(c => c.Documents)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (car is null)
                return NotFound();

            foreach (var doc in car.Documents)
            {
                if (!string.IsNullOrEmpty(doc.FilePath))
                    await _blobStorage.DeleteFileAsync(doc.FilePath);

                _context.Documents.Remove(doc);
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }




    }
    
}
