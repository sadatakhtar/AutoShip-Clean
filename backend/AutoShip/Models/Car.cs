using System.Reflection.Metadata;

namespace AutoShip.Models
{
    public enum CarStatus
    {
        AwaitingDocuments,
        DocumentsReceived,
        SentToCustoms,
        CustomsCleared,
        CollectedFromPort,
        IVACompleted,
        V55Submitted,
        MOTCompleted,
        Registered
    }

    public class Car
    {
        public int Id { get; set; }
        public string? VIN { get; set; }
        public string? Make { get; set; }
        public string? Model { get; set; }
        public DateTime ManufactureDate { get; set; }
        public CarStatus Status { get; set; }
        public string? IVAStatus { get; set; }
        public string? MOTStatus { get; set; }
        public string? V55Status { get; set; }

        public ICollection<Documents> Documents { get; set; } = new List<Documents>();
        public CustomsClearance? Clearance { get; set; }
        public RegistrationProcess? Registration { get; set; }


    }
}
