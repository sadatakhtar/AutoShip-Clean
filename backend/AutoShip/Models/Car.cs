using System.Reflection.Metadata;

namespace AutoShip.Models
{
    //public enum CarStatus
    //{
    //    Available,
    //    InTransit,
    //    Sold,
    //    Reserved,
    //    Registered

    //}

    public class Car
    {
        public int Id { get; set; }
        public string? VIN { get; set; }
        public string? Make { get; set; }
        public string? Model { get; set; }
        public DateTime ManufactureDate { get; set; }
        public string? Status { get; set; }
        public string? IVAStatus { get; set; }
        public string? MOTStatus { get; set; }
        public string? V55Status { get; set; }
        public string? ImageBlobName { get; set; }
        public ICollection<Documents> Documents { get; set; } = new List<Documents>();
        public CustomsClearance? Clearance { get; set; }
        public RegistrationProcess? Registration { get; set; }


    }
}
