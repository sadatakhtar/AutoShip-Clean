using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoShip.Migrations
{
    /// <inheritdoc />
    public partial class AddReimbursedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReimbursedAt",
                table: "Costs",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReimbursedAt",
                table: "Costs");
        }
    }
}
