using System.ComponentModel.DataAnnotations;

namespace Budgetly.Application.Models
{
    public class APIResponse
    {
        [Required]
        public bool success { get; set; }

        [Required]
        public string message { get; set; }

        public Object? data { get; set; }
    }
}
