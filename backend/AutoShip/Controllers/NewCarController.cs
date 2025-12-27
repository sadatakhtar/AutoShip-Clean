using AutoShip.Data;
using AutoShip.DTOs;
using AutoShip.Models;
using Mapster;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult> Create([FromBody] CarCreateDto dto)
        {
            Console.WriteLine(">>> NEWCAR ENDPOINT HIT <<<");
            Console.WriteLine("VIN: " + dto.VIN);
            Console.WriteLine("IVA: " + dto.IVAStatus);
            Console.WriteLine("MOT: " + dto.MOTStatus);
            Console.WriteLine("V55: " + dto.V55Status);
            Console.WriteLine("DOCs: " + dto.Documents);

            var car = dto.Adapt<Car>();
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return Ok(car.Id);
        }


    }
}
