using AutoShip.Models;

namespace AutoShip.DTOs
{
    public class CarDto
    {
        public int Id { get; set; }
        public string VIN { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string Status { get; set; }
        public string IVAStatus { get; set; }
        public string MOTStatus { get; set; }
        public string V55Status { get; set; }

        public List<DocumentDto> Documents { get; set; }


    }
}

