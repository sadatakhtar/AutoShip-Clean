using AutoShip.Data;
using AutoShip.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoShip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CostController : ControllerBase
    {
        private readonly ImportDbContext _context;

        public CostController(ImportDbContext context)
        {
            _context = context;
        }

        // ---------------------------------------------------------
        // POST: api/Cost
        // Add a single cost entry
        // ---------------------------------------------------------
        [HttpPost]
        public async Task<IActionResult> AddCost([FromBody] Cost cost)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Costs.Add(cost);
            await _context.SaveChangesAsync();

            return Ok(cost);
        }

        // ---------------------------------------------------------
        // GET: api/Cost/vehicle/5
        // Get all costs for a specific car
        // ---------------------------------------------------------
        [HttpGet("vehicle/{carId}")]
        public async Task<IActionResult> GetCostsForVehicle(int carId)
        {
            var costs = await _context.Costs
                .Where(c => c.CarId == carId)
                .Include(c => c.PaidByUser)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Category,
                    c.Amount,
                    c.Date,
                    c.Notes,
                    c.IsReimbursed,
                    PaidByUserName = c.PaidByUser.Username
                })
                .ToListAsync();

            return Ok(costs);
        }

        // ---------------------------------------------------------
        // GET: api/Cost/vehicle/5/total
        // Get total cost for a car
        // ---------------------------------------------------------
        [HttpGet("vehicle/{carId}/total")]
        public async Task<IActionResult> GetTotalCost(int carId)
        {
            var total = await _context.Costs
                .Where(c => c.CarId == carId)
                .SumAsync(c => c.Amount);

            return Ok(new { carId, total });
        }
    }
}
