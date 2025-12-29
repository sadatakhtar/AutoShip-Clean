namespace AutoShip.DTOs
{
    public class DocumentDto
    {
        public int CarId { get; set; }
        public string FileName { get; set; }   // useful for downloads
        public string FilePath { get; set; }
        public string Type { get; set; }
        public DateTime ReceivedDate { get; set; }
    }
}
