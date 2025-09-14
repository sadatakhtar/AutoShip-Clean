namespace AutoShip.Models
{
    public class RegistrationProcess
    {
        public int Id { get; set; }
        public DateTime IVASubmitted { get; set; }
        public DateTime V55Submitted { get; set; }
        public DateTime MOTCompleted { get; set; }
        public DateTime RegistrationReceived { get; set; }

        //FK
        public int CarId { get; set; }
        public Car? Car { get; set; }


    }
}
