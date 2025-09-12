using Budgetly.Application;
using Budgetly.Infrastructure;

namespace Budgetly.API
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddAppDI(this IServiceCollection services)
        {
            services.AddApplicationDI();
            services.AddInfrastructureDI();

            return services;
        }
    }
}
