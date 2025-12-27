using AutoShip.Data;
using AutoShip.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoShip.Controllers
{
    public class RegisterationController : ControllerBase
    {
        private readonly ImportDbContext _context;

        public RegisterationController(ImportDbContext context)
        {
            _context = context;
        }

        [HttpPut("received")]
        public async Task<IActionResult> UpdateRegistrationReceivedDate(int carId, DateTime receivedDate)
        {
            var registration = await _context.Registrations.FirstOrDefaultAsync(r => r.CarId == carId);
            if (registration == null) return NotFound();

            registration.RegistrationReceived = receivedDate;

            // Optional: update car status
            var car = await _context.Cars.FindAsync(carId);
            if (car != null)
            {
                car.Status = "Registered";
            }


            await _context.SaveChangesAsync();
            return Ok(registration);
        }


    }
}
