using Microsoft.Extensions.DependencyInjection;

// Create a service collection.
// This is where we tell .NET which classes it is allowed to build for us.
var services = new ServiceCollection();

// Register IMessageWriter so the container knows which concrete class to use.
// When something asks for IMessageWriter, the container will give ConsoleMessageWriter.
services.AddTransient<IMessageWriter, ConsoleMessageWriter>();

// Register Greeter too.
// The container will look at Greeter's constructor and inject its dependency automatically.
services.AddTransient<Greeter>();

// Build the service provider.
// This turns the registrations above into a working DI container.
using var serviceProvider = services.BuildServiceProvider();

// Ask the container for a Greeter object.
// The container creates Greeter and also creates the IMessageWriter it needs.
var greeter = serviceProvider.GetRequiredService<Greeter>();

// Run the app logic.
// Greeter uses the injected IMessageWriter to print the message.
greeter.Greet("Mona");