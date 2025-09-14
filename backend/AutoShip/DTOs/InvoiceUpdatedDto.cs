namespace AutoShip.DTOs
{
    public class InvoiceUpdatedDto
    {
        public decimal ShippingCost { get; set; }
        public decimal CustomsFee { get; set; }
        public decimal RegistrationFee { get; set; }
        public decimal OtherCharges { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsPaid { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }
    }
}
