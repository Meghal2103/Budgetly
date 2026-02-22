using System.Security.Claims;
using Budgetly.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http;

namespace Budgetly.API.Services
{
    public sealed class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public bool IsAuthenticated => User?.Identity?.IsAuthenticated == true;

        public int? UserId
        {
            get
            {
                var value = User?.FindFirstValue(ClaimTypes.NameIdentifier)
                           ?? User?.FindFirstValue("sub")
                           ?? User?.FindFirstValue("userId");
                return int.TryParse(value, out var id) ? id : null;
            }
        }

        public string? Email =>
            User?.FindFirstValue(ClaimTypes.Email)
            ?? User?.FindFirstValue("email");

        public string[] Roles =>
            User?.FindAll(ClaimTypes.Role).Select(r => r.Value).ToArray()
            ?? Array.Empty<string>();

        private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;
    }
}
