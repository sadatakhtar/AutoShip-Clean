using AutoShip.Configuration;
using AutoShip.Data;
using AutoShip.Models;
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
    options.ListenAnyIP(5000); // match your container port
});

// Add health checks
builder.Services.AddHealthChecks();

// Optional: you can also add DB check
builder.Services.AddHealthChecks()
    .AddSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        name: "MSSQL"
    );


// Configure services
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    Console.WriteLine(">>> ApiBehaviorOptions configured <<<");
});

builder.Services.AddMapster();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

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
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] 
             ?? throw new Exception("JWT Key missing");
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

// --- DATABASE MIGRATIONS + SEEDING ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ImportDbContext>();

    try
    {
        Console.WriteLine(">>> Applying database migrations...");
        context.Database.Migrate();

        // Seed default admin user if none exists
        if (!context.Users.Any(u => u.Username == "admin1"))
        {
            Console.WriteLine(">>> Seeding default admin1 user...");
            var hasher = new PasswordHasher<User>();
            var admin = new User
            {
                Username = "admin1",
                Email = "admin@example.com",
                Role = "Admin",
                PasswordHash = hasher.HashPassword(null, "admin123") // default password
            };

            context.Users.Add(admin);
            context.SaveChanges();

            Console.WriteLine("✅ Default admin user created: admin1 / admin123");
        }
        else
        {
            Console.WriteLine("✅ Admin user already exists, skipping seeding.");
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

// Map health check endpoint
app.MapHealthChecks("/health");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowReactApp");
app.MapControllers();
app.Run();

