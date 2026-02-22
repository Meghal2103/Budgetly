using Budgetly.API.Models;
using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Services;
using Budgetly.Core.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgetly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TransactionController(ITransactionService transactionService) : ControllerBase
    {
        [HttpPost("add-transaction")]
        public async Task<IActionResult> AddTransaction([FromBody] AddEditTransaction addEditTransaction)
        {
            APIResponse<TransactionViewModel> response = new();

            if (!ModelState.IsValid)
            {
                response.Success = false;
                response.Message = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));

                return BadRequest(response);
            }

            var transactionDTO = await transactionService.AddTransaction(addEditTransaction);
            response.Success = true;
            response.Message = "Transaction added successfully.";
            response.Data = transactionDTO;

            return Ok(response);
        }

        [HttpGet("get-all-transactions")]
        public async Task<IActionResult> GetTransactions()
        {
            APIResponse<TransactionsDTO> response = new();

            var transactions = await transactionService.GetTransactions();
            response.Success = true;
            response.Message = "Transaction returned successfully.";
            response.Data = transactions;

            return Ok(response);
        }

        [HttpPost("get-transactions")]
        public async Task<IActionResult> GetTransactions([FromBody] TransactionsRequestDTO transactionsRequestDTO)
        {
            APIResponse<TransactionsDTO> response = new();

            var transactions = await transactionService.RequestTransactions(transactionsRequestDTO);
            response.Success = true;
            response.Message = "Transaction search returned successfully.";
            response.Data = transactions;

            return Ok(response);
        }

        [HttpGet("export-all-transactions")]
        public async Task<IActionResult> ExportAllTransactions()
        {
            var content = await transactionService.ExportAllTransactionsExcel();
            var fileName = $"transactions-{DateTime.UtcNow:yyyyMMddHHmmss}.xlsx";
            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        [HttpPost("export-transactions")]
        public async Task<IActionResult> ExportFilteredTransactions([FromBody] TransactionsRequestDTO transactionsRequestDTO)
        {
            var content = await transactionService.ExportTransactionsExcel(transactionsRequestDTO);
            var fileName = $"transactions-filtered-{DateTime.UtcNow:yyyyMMddHHmmss}.xlsx";
            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        [HttpGet("get-transaction-type")]
        public async Task<IActionResult> GetTransactionType()
        {
            APIResponse<List<TransactionType>> response = new();

            var transactionTypes = await transactionService.GetTransactionType();
            response.Success = true;
            response.Message = "Transaction types returned successfully.";
            response.Data = transactionTypes;

            return Ok(response);
        }

        [HttpGet("get-categories")]
        public async Task<IActionResult> GetCategories()
        {
            APIResponse<List<Category>> response = new();

            var categories = await transactionService.GetCategories();
            response.Success = true;
            response.Message = "Transaction types returned successfully.";
            response.Data = categories;

            return Ok(response);
        }
    }
}
