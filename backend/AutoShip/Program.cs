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
        policy => policy.WithOrigins("http://localhost:5173", "http://localhost:5174","http://autoship-frontend:5173")
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


// --- DATABASE MIGRATIONS + FORCED SEEDING ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ImportDbContext>();

    try
    {
        Console.WriteLine(">>> Applying database migrations...");
        context.Database.Migrate();

        Console.WriteLine(">>> Forcing seeding of superadmin user...");

        var hasher = new PasswordHasher<User>();

        // Remove existing user if exists
        var existing = context.Users.FirstOrDefault(u => u.Username == "superadmin");
        if (existing != null)
        {
            context.Users.Remove(existing);
            context.SaveChanges();
        }

        // Create fresh user
        var super = new User
        {
            Username = "superadmin",
            Email = "superadmin@example.com",
            Role = "Admin"
        };

        super.PasswordHash = hasher.HashPassword(super, "super123");

        context.Users.Add(super);
        context.SaveChanges();

        Console.WriteLine(">>> Superadmin user created: superadmin / super123");

        // Seed sample cars if none exist
        if (!context.Cars.Any())
        {
            Console.WriteLine(">>> Seeding sample cars...");

            var car1 = new Car
            {
                VIN = "TESTVIN1234567890",
                Make = "Toyota",
                Model = "Corolla",
                ManufactureDate = new DateTime(2020, 5, 1),
                Status = "Imported",
                IVAStatus = "Pending",
                MOTStatus = "Not Required",
                V55Status = "Not Submitted",
                ImageBlobName = null
            };

            var car2 = new Car
            {
                VIN = "TESTVIN0987654321",
                Make = "Honda",
                Model = "Civic",
                ManufactureDate = new DateTime(2019, 3, 15),
                Status = "Registered",
                IVAStatus = "Completed",
                MOTStatus = "Passed",
                V55Status = "Approved",
                ImageBlobName = null
            };

            context.Cars.AddRange(car1, car2);
            context.SaveChanges();

            Console.WriteLine(">>> Sample cars seeded.");
        }

    }
    catch (Exception ex)
    {
        Console.WriteLine($">>> Error seeding database: {ex.Message}");
    }
}


// HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseDefaultFiles();
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
            Path.Combine(Directory.GetCurrentDirectory(), "WebClient", "dist"))
    });

    app.MapFallbackToFile("index.html");
}

app.MapScalarApiReference(options => options.WithPersistentAuthentication());
app.MapHealthChecks("/health");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowReactApp");
app.MapControllers();
app.Run();



