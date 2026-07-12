public class ConsoleMessageWriter : IMessageWriter
{
    public void Write(string message)
    {
        // This class only knows how to write a message.
        Console.WriteLine(message);
    }
}