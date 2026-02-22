using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoShip.Migrations
{
    /// <inheritdoc />
    public partial class AddImageBlobNameToCar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageBlobName",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageBlobName",
                table: "Cars");
        }
    }
}
