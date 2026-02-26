using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Budgetly.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class idUpdate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_TransactionTypes_TransactionTypeID",
                table: "Transactions");

            migrationBuilder.RenameColumn(
                name: "TransactionTypeID",
                table: "Transactions",
                newName: "TransactionTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_TransactionTypeID",
                table: "Transactions",
                newName: "IX_Transactions_TransactionTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_TransactionTypes_TransactionTypeId",
                table: "Transactions",
                column: "TransactionTypeId",
                principalTable: "TransactionTypes",
                principalColumn: "TransactionTypeId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_TransactionTypes_TransactionTypeId",
                table: "Transactions");

            migrationBuilder.RenameColumn(
                name: "TransactionTypeId",
                table: "Transactions",
                newName: "TransactionTypeID");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_TransactionTypeId",
                table: "Transactions",
                newName: "IX_Transactions_TransactionTypeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_TransactionTypes_TransactionTypeID",
                table: "Transactions",
                column: "TransactionTypeID",
                principalTable: "TransactionTypes",
                principalColumn: "TransactionTypeId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
