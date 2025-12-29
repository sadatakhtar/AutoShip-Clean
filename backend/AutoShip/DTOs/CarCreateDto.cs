using AutoShip.Models;
using Microsoft.AspNetCore.Mvc;

namespace AutoShip.DTOs
{
    [BindProperties]
    public class CarCreateDto
    {
        public string? VIN { get; set; }
        public string? Make { get; set; }
        public string? Model { get; set; }
        public DateTime ManufactureDate { get; set; }
        public string? Status { get; set; }
        public List<IFormFile>? Documents { get; set; }
        public string? DocumentType { get; set; }
        public string? IVAStatus { get; set; }
        public string? MOTStatus { get; set; }
        public string? V55Status { get; set; }


    }
}
