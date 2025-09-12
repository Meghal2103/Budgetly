using Budgetly.Core;
using Microsoft.Extensions.DependencyInjection;

namespace Budgetly.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationDI(this IServiceCollection services)
        {
            services.AddCoreDI();

            return services;
        }
    }
}
