using AutoShip.Configuration;
using AutoShip.Data;
using AutoShip.Models;
using BCrypt.Net;
using Mapster;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddMapster();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();
builder.Services.AddOpenApi("v1", options =>
{
    options.AddDocumentTransformer<BearerSecurityTransformer>();
});


// Build the app.
builder.Services.AddDbContext<ImportDbContext>(options => 
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionString")));

// Allow Cors for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


// Access configuration values
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

// Jwt
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();




var app = builder.Build();

// Seed initial admin user if none exists
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ImportDbContext>();

    if (!context.Users.Any(u => u.Username == "admin"))
    {
        var hasher = new PasswordHasher<User>();

        var admin = new User
        {
            Username = "admin",
            Role = "Admin",
            PasswordHash = hasher.HashPassword(null, "password")
        };

        context.Users.Add(admin);
        context.SaveChanges();
    }
}



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else 
{
    // Serve React (Vite build output) in production
    app.UseDefaultFiles();
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
            Path.Combine(Directory.GetCurrentDirectory(), "WebClient", "dist"))
    });

    // Fallback to index.html (SPA routing)
    app.MapFallbackToFile("index.html");
}

//app.MapScalarApiReference();
app.MapScalarApiReference(options =>
{
    options.WithPersistentAuthentication(); 
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseCors("AllowReactApp");
app.MapControllers();
app.Run();
