using System.Security.Claims;
using Budgetly.Core.Models;

namespace Budgetly.API.Middleware
{
    public class CurrentUserMiddleware
    {
        private readonly RequestDelegate _next;

        public CurrentUserMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, CurrentUser currentUser)
        {
            var user = context.User;
            currentUser.IsAuthenticated = user?.Identity?.IsAuthenticated == true;

            var id = user?.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? user?.FindFirstValue("sub")
                     ?? user?.FindFirstValue("userId");
            currentUser.UserId = int.TryParse(id, out var parsed) ? parsed : null;

            currentUser.Email = user?.FindFirstValue(ClaimTypes.Email)
                               ?? user?.FindFirstValue("email");

            currentUser.Roles = user?.FindAll(ClaimTypes.Role).Select(r => r.Value).ToArray()
                             ?? Array.Empty<string>();

            await _next(context);
        }
    }
}
