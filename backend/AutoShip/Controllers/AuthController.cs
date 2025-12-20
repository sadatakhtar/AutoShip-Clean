using AutoShip.Data;
using AutoShip.DTOs;
using AutoShip.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AutoShip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ImportDbContext _db;

        public AuthController(IConfiguration config, ImportDbContext db)
        {
            _config = config;
            _db = db;
        }

        // REGISTER (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (_db.Users.Any(u => u.Username == dto.Username))
                return BadRequest("Username already taken");

            var hasher = new PasswordHasher<User>();

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Role = "User",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            user.PasswordHash = hasher.HashPassword(user, dto.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        // LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _db.Users.SingleOrDefault(u => u.Username == dto.Username);
            if (user == null)
                return Unauthorized("Invalid username or password");

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid username or password");

            // Create JWT
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("SecurityStamp", user.SecurityStamp)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        // CHANGE PASSWORD (Authenticated users)
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var username = User.Identity?.Name;

            if (username == null)
                return Unauthorized("Invalid token");

            var user = _db.Users.SingleOrDefault(u => u.Username == username);

            if (user == null)
                return Unauthorized("User not found");

            var hasher = new PasswordHasher<User>();

            // Verify current password
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, dto.CurrentPassword);
            if (result == PasswordVerificationResult.Failed)
                return BadRequest("Current password is incorrect");

            // Hash new password
            user.PasswordHash = hasher.HashPassword(user, dto.NewPassword);

            // Update security stamp to invalidate old tokens
            user.SecurityStamp = Guid.NewGuid().ToString();

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }
    }
}
















