namespace AutoShip.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public required string InvoiceNumber { get; set; } 
        public DateTime IssueDate { get; set; }
        public DateTime? DueDate { get; set; }

        // Financials
        public decimal ShippingCost { get; set; }
        public decimal CustomsFee { get; set; }
        public decimal RegistrationFee { get; set; }
        public decimal OtherCharges { get; set; }
        public decimal TotalAmount => ShippingCost + CustomsFee + RegistrationFee + OtherCharges;

        // Payment Info
        public bool IsPaid { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? PaymentMethod { get; set; }

        // Relationships
        public int CarId { get; set; }
        public Car? Car { get; set; }

        public string? Notes { get; set; }

    }
}
