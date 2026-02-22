using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetly.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class registration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Transactions_CategoryId_NotZero",
                table: "Transactions",
                sql: "[CategoryId] <> 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Transactions_TransactionTypeID_NotZero",
                table: "Transactions",
                sql: "[TransactionTypeID] <> 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Transactions_CategoryId_NotZero",
                table: "Transactions");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Transactions_TransactionTypeID_NotZero",
                table: "Transactions");
        }
    }
}
