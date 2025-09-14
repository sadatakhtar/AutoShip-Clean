using AutoShip.Data;
using AutoShip.DTOs;
using AutoShip.Models;
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
        public CarController(ImportDbContext context)
        {
            _context = context;
        }

        // Add methods for CRUD operations here
        //[Authorize]
        [HttpGet]
        public async Task<ActionResult<Car>> GetAllCars()
        {
            var cars = await _context.Cars.ToListAsync();
            return Ok(cars);

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
        public async Task<ActionResult<Car>> AddCar(CarCreateDto dto)
        {
            var car = dto.Adapt<Car>();
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();
            return Ok(car.Id);

        }

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

            _context.Cars.Update(car);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Car>> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car is null)
                return NotFound();
            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
    
}
