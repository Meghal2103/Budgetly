using DocumentFormat.OpenXml.Spreadsheet;

namespace Budgetly.Application.Exceptions
{
    public class UserNotFoundException(string email) : Exception($"No user found with email {email}")
    {
        
    }

    public class UserAlreadyExistsException(string email) : Exception($"User with email {email} already exists.")
    {

    }

    public class InvalidField(string field) : Exception($"Invalid value for field {field}.")
    {

    }

    public class TransctionNotFound() : Exception($"Requested Transaction was not found")
    {

    }
}
