namespace AutoShip.Models
{
    public class Cost
    {
        public int Id { get; set; }

        public int CarId { get; set; }
        public Car? Car { get; set; }

        public string Name { get; set; }
        public string Category { get; set; }

        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        public int PaidByUserId { get; set; }
        public User? PaidByUser { get; set; }

        public string Notes { get; set; }

        public bool IsReimbursed { get; set; } = false;
    }
}
