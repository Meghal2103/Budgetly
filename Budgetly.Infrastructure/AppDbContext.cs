using Budgetly.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Budgetly.Infrastructure
{
    class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionType> TransactionTypes { get; set; }
        public DbSet<Category> Categorys { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
            });

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasOne(t => t.User)
                    .WithMany(u => u.Transactions)
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(t => t.Category)
                    .WithMany(c => c.Transactions)
                    .HasForeignKey(t => t.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.TransactionType)
                    .WithMany(t => t.Transactions)
                    .HasForeignKey(t => t.TransactionTypeID)
                    .OnDelete(DeleteBehavior.Restrict); 
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(e => e.CategoryName).IsUnique();
            });

            modelBuilder.Entity<TransactionType>(entity =>
            {
                entity.HasIndex(e => e.TransactionTypeName).IsUnique();
            });
        }
    }
}
