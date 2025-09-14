namespace AutoShip.DTOs
{
    public class InvoiceDto
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime? DueDate { get; set; }

        public decimal ShippingCost { get; set; }
        public decimal CustomsFee { get; set; }
        public decimal RegistrationFee { get; set; }
        public decimal OtherCharges { get; set; }
        public decimal TotalAmount { get; set; }

        public bool IsPaid { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? PaymentMethod { get; set; }

        public int CarId { get; set; }
        public string CarMake { get; set; }
        public string CarModel { get; set; }
        public string VIN { get; set; }

        public string? Notes { get; set; }

    }
}
