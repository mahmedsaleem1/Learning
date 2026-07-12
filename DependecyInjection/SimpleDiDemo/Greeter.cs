public class Greeter
{
    private readonly IMessageWriter _writer;

    public Greeter(IMessageWriter writer)
    {
        // The Greeter does not create its own dependency.
        // The container gives it an IMessageWriter.
        
        _writer = writer;
    }

    public void Greet(string name)
    {
        _writer.Write($"Hello, {name}!");
    }
}