namespace AutoShip.DTOs
{
    public class InvoiceCreatedDto
    {
        public int CarId { get; set; }

        public decimal ShippingCost { get; set; }
        public decimal CustomsFee { get; set; }
        public decimal RegistrationFee { get; set; }
        public decimal OtherCharges { get; set; }

        public DateTime? DueDate { get; set; }
        public string? Notes { get; set; }

    }
}
