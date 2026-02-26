using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetly.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class idUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TransactionTypeID",
                table: "TransactionTypes",
                newName: "TransactionTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TransactionTypeId",
                table: "TransactionTypes",
                newName: "TransactionTypeID");
        }
    }
}
