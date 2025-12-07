using AutoShip.Models;

namespace AutoShip.DTOs
{
    public class CarCreateDto
    {
        public string? VIN { get; set; }
        public string? Make { get; set; }
        public string? Model { get; set; }
        public DateTime ManufactureDate { get; set; }
        public CarStatus Status { get; set; }
        public List<DocumentDto>? Documents { get; set; }


    }
}
