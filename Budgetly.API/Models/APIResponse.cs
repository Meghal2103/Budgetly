namespace Budgetly.API.Models
{
    public class APIResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }
        public T? Data { get; set; }

        public static APIResponse<object> Error(string message)
        {
            return new APIResponse<object>
            {
                Success = false,
                Message = message,
            };
        }
    }
}
