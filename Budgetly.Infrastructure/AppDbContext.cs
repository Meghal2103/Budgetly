using Budgetly.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Budgetly.Infrastructure
{
    class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionType> TransactionTypes { get; set; }
        public DbSet<Category> Categories { get; set; }

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

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable(t =>
                {
                    t.HasCheckConstraint(
                        "CK_Transactions_CategoryId_NotZero",
                        "[CategoryId] <> 0");

                    t.HasCheckConstraint(
                        "CK_Transactions_TransactionTypeID_NotZero",
                        "[TransactionTypeID] <> 0");
                });
            });

            modelBuilder.Entity<TransactionType>().HasData(
                new TransactionType
                {
                    TransactionTypeID = 1,
                    TransactionTypeName = "UPI"
                },
                new TransactionType
                {
                    TransactionTypeID = 2,
                    TransactionTypeName = "Card"
                },
                new TransactionType
                {
                    TransactionTypeID = 3,
                    TransactionTypeName = "Cash"
                }
            );

            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Food" },
                new Category { CategoryId = 2, CategoryName = "Fuel" },
                new Category { CategoryId = 3, CategoryName = "Hygiene" },
                new Category { CategoryId = 4, CategoryName = "Fitness" },
                new Category { CategoryId = 5, CategoryName = "Housing" },
                new Category { CategoryId = 6, CategoryName = "Utilities" },
                new Category { CategoryId = 7, CategoryName = "Entertainment" },
                new Category { CategoryId = 8, CategoryName = "Healthcare" },
                new Category { CategoryId = 9, CategoryName = "Education" }
            );
        }
    }
}
