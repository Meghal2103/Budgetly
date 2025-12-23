using Budgetly.Application.Interfaces;
using Budgetly.Application.Mapping;
using Budgetly.Application.Services;
using Budgetly.Core;
using Budgetly.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Budgetly.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationDI(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITransactionService, TransactionService>();
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<ApplicationMapper>();
            });

            services.AddCoreDI();

            return services;
        }
    }
}
