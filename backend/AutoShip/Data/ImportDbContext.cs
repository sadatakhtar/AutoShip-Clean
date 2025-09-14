using AutoShip.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace AutoShip.Data
{
    public class ImportDbContext : DbContext
    {
        public ImportDbContext(DbContextOptions<ImportDbContext> options) : base(options) { }

        public DbSet<Car> Cars { get; set; }
        public DbSet<Documents> Documents { get; set; }
        public DbSet<CustomsClearance> Clearances { get; set; }
        public DbSet<RegistrationProcess> Registrations { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        // public object Invoices { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Car>()
                .HasMany(c => c.Documents)
                .WithOne(d => d.Car)
                .HasForeignKey(d => d.CarId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Car>()
                .HasOne(c => c.Clearance)
                .WithOne(cc => cc.Car)
                .HasForeignKey<CustomsClearance>(cc => cc.CarId);

            modelBuilder.Entity<Car>()
                .HasOne(c => c.Registration)
                .WithOne(r => r.Car)
                .HasForeignKey<RegistrationProcess>(r => r.CarId);
        }

    }
}
