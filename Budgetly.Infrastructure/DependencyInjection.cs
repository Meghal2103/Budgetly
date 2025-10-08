using Budgetly.Application.Interfaces;
using Budgetly.Core.Interfaces.Repository;
using Budgetly.Infrastructure.Repositories;
using Budgetly.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Budgetly.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureDI(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("ConnectionStringsD")));
            services.AddScoped<ISecurityServices, SecurityServices>();
            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}
