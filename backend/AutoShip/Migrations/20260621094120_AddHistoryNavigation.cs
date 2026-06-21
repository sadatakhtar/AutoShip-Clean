using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoShip.Migrations
{
    /// <inheritdoc />
    public partial class AddHistoryNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ReimbursementHistory_CostId",
                table: "ReimbursementHistory",
                column: "CostId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReimbursementHistory_Costs_CostId",
                table: "ReimbursementHistory",
                column: "CostId",
                principalTable: "Costs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReimbursementHistory_Costs_CostId",
                table: "ReimbursementHistory");

            migrationBuilder.DropIndex(
                name: "IX_ReimbursementHistory_CostId",
                table: "ReimbursementHistory");
        }
    }
}
