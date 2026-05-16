using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoShip.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingMotAndV55Columns : Migration
    {
        /// <inheritdoc />
      protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.AddColumn<string>(
        name: "MOTStatus",
        table: "Cars",
        type: "nvarchar(max)",
        nullable: true);

    migrationBuilder.AddColumn<string>(
        name: "V55Status",
        table: "Cars",
        type: "nvarchar(max)",
        nullable: true);
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DropColumn(
        name: "MOTStatus",
        table: "Cars");

    migrationBuilder.DropColumn(
        name: "V55Status",
        table: "Cars");
}

    }
}
