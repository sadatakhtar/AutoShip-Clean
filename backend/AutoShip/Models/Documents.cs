namespace AutoShip.Models
{
    public class Documents
    {
        public int Id { get; set; }
        public string? Type { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; } // should contain something like: "VIN/uuid_filename.pdf"
        public DateTime ReceivedDate { get; set; }

        // Foreign key to Car
        public int CarId { get; set; }
        public Car? Car { get; set; }

    }
}
