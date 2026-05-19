using AutoShip.Configuration;
using AutoShip.Data;
using AutoShip.Models;
using AutoShip.Services;
using Mapster;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Listen on all network interfaces
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
});

// Blob storage
builder.Services.AddScoped<BlobStorageService>();

// Health checks
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), name: "MSSQL");

// API behaviour
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    Console.WriteLine(">>> ApiBehaviorOptions configured <<<");
});

// MVC + JSON
builder.Services.AddMapster();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// OpenAPI
builder.Services.AddOpenApi("v1", options =>
{
    options.AddDocumentTransformer<BearerSecurityTransformer>();
});

// DB Context
builder.Services.AddDbContext<ImportDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://autoship-frontend:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new Exception("JWT Key missing");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<EmailService>();

var app = builder.Build();


// --- DATABASE MIGRATIONS + SAFE SEEDING ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ImportDbContext>();

    try
    {
        Console.WriteLine(">>> Applying database migrations...");

        // Only migrate if needed
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }

        // Seed superadmin ONLY if missing
        if (!context.Users.Any(u => u.Username == "superadmin"))
        {
            Console.WriteLine(">>> Seeding superadmin user...");

            var hasher = new PasswordHasher<User>();

            var super = new User
            {
                Username = "superadmin",
                Email = "superadmin@example.com",
                Role = "Admin"
            };

            super.PasswordHash = hasher.HashPassword(super, "super123");

            context.Users.Add(super);
            context.SaveChanges();

            Console.WriteLine(">>> Superadmin user created.");
        }

        // Seed sample cars ONLY if empty
        if (!context.Cars.Any())
        {
            Console.WriteLine(">>> Seeding sample cars...");

            context.Cars.AddRange(
                new Car
                {
                    VIN = "TESTVIN1234567890",
                    Make = "Toyota",
                    Model = "Corolla",
                    ManufactureDate = new DateTime(2020, 5, 1),
                    Status = "Imported",
                    IVAStatus = "Pending",
                    MOTStatus = "Not Required",
                    V55Status = "Not Submitted"
                },
                new Car
                {
                    VIN = "TESTVIN0987654321",
                    Make = "Honda",
                    Model = "Civic",
                    ManufactureDate = new DateTime(2019, 3, 15),
                    Status = "Registered",
                    IVAStatus = "Completed",
                    MOTStatus = "Passed",
                    V55Status = "Approved"
                }
            );

            context.SaveChanges();
            Console.WriteLine(">>> Sample cars seeded.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($">>> Error during migration/seeding: {ex.Message}");
    }
}


// HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    // Only serve frontend in REAL production
    var distPath = Path.Combine(Directory.GetCurrentDirectory(), "WebClient", "dist");

    if (Directory.Exists(distPath))
    {
        app.UseDefaultFiles();
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(distPath)
        });

        app.MapFallbackToFile("index.html");
    }
}

app.MapScalarApiReference(options => options.WithPersistentAuthentication());
app.MapHealthChecks("/health");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();



