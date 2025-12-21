using AutoShip.Data;
using AutoShip.DTOs;
using AutoShip.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AutoShip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ImportDbContext _db;
        private readonly EmailService _emailService;

        public AuthController(IConfiguration config, ImportDbContext db, EmailService emailService)
        {
            _config = config;
            _db = db;
            _emailService = emailService;
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

        // FORGOT PASSWORD
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = _db.Users.SingleOrDefault(u => u.Email == dto.Email);
            if (user == null)
                return Ok(new { message = "If that email exists, a reset link has been sent." });

            // ✅ Generate strong secure token
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            // ✅ Build reset link
            var resetLink = $"http://localhost:3000/reset-password?token={token}";

            // ✅ Send email
            await _emailService.SendEmailAsync(
                user.Email,
                "Password Reset Request",
                $@"<h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <p><a href='{resetLink}'>Reset Password</a></p>
                <p>This link will expire in 1 hour.</p>"
            );

            return Ok(new { message = "If that email exists, a reset link has been sent." });
        }

        // RESET PASSWORD
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = _db.Users.SingleOrDefault(u => u.ResetToken == dto.Token);

            if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired token");

            var hasher = new PasswordHasher<User>();
            user.PasswordHash = hasher.HashPassword(user, dto.NewPassword);

            // ✅ Clear token
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            // ✅ Invalidate old JWTs
            user.SecurityStamp = Guid.NewGuid().ToString();

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Password has been reset successfully" });
        }

        // SMTP TEST ENDPOINT
        [HttpGet("send-test-email")]
        public async Task<IActionResult> SendTestEmail()
        {
            try
            {
                await _emailService.SendEmailAsync(
                    "youraddress@gmail.com",
                    "SMTP Test Email",
                    "<h2>Your SMTP setup works!</h2><p>This is a test email sent from your .NET backend.</p>"
                );

                return Ok("Test email sent successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to send email: {ex.Message}");
            }
        }
    }
}













