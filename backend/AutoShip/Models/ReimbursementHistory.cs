using AutoShip.Models;

public class ReimbursementHistory
{
    public int Id { get; set; }
    public int CostId { get; set; }
     public Cost Cost { get; set; }  
    public string User { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Action { get; set; } = string.Empty; // reimburse / undo / bulk-reimburse / bulk-undo
    public DateTime Timestamp { get; set; }
}
