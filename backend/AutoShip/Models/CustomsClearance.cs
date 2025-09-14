namespace AutoShip.Models
{
    public class CustomsClearance
    {
        public int Id  {get; set; }
        public string AgentName { get; set; }
        public DateTime SentDate { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime CollectionDate { get; set; }

        // FK
        public int CarId { get; set; }
        public Car Car { get; set; }
    }


}

