$dll=$args[0]
$handlerPath=$args[1]
$handler=$args[2]
$eventInput=$args[3]
$context=$args[4]

$dllPath = Split-Path -Path $dll
$dllFileName = Split-Path $dll -leaf
$lambdaCorePath = "$($dllPath)/Amazon.Lambda.Core.dll"

# $assmLocation = "$(Get-Location)/assemblies"

# Define a FakeLambdaContext to use for deserializing context
# Include required references.
# netstandard must be included for System
$fakeLambdaRefs = (
    "netstandard, Version=2.0.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51",
    $lambdaCorePath
)

$fakeLambdaContextSource = @"
using Amazon.Lambda.Core;
using System;

public class FakeLambdaLogger : ILambdaLogger {
  public void Log(string message) => LambdaLogger.Log(message);
  public void LogLine(string message) => LambdaLogger.Log(message);
}

public class FakeLambdaContext : ILambdaContext {
    public string AwsRequestId { get; set; }
    public IClientContext ClientContext { get; set; }
    public string FunctionName { get; set; }
    public string FunctionVersion { get; set; }
    public ICognitoIdentity Identity { get; set; }
    public string InvokedFunctionArn { get; set; }
    public ILambdaLogger Logger { get; set; } = new FakeLambdaLogger();
    public string LogGroupName { get; set; }
    public string LogStreamName { get; set; }
    public int MemoryLimitInMB { get; set; }
    public TimeSpan RemainingTime { get; set; }
}
"@

try {
  # Add FakeLambdaContext and Handler assembly
  Add-Type -ReferencedAssemblies $fakeLambdaRefs -TypeDefinition $fakeLambdaContextSource

  # $ms = (
  #   "netstandard, Version=2.0.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51"
  # )
  # $refFolder = Join-Path ( Split-Path ([PSObject].Assembly.Location) ) "ref"

  # $refAssemblies = Get-ChildItem -Path $netCorePath -Filter "*.dll" | Select-Object -Expand FullName
  # $assemblies = Get-ChildItem -Path $dllPath -Exclude $dllFileName -Filter "*.dll" -Recurse | Select-Object -Expand FullName

  # # Write-Host $refAssemblies

  # $refs = @($ms + $refAssemblies + $assemblies)

  #Add-Type -ReferencedAssemblies $refs -Path $dll -PassThru

  #$netCorePath = "/home/vscode/.dotnet/shared/Microsoft.AspNetCore.App/3.1.17"

  #Add-Type -Path "$($netCorePath)/Microsoft.AspNetCore.Mvc.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.AspNetCore.Http.Features.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.AspNetCore.Hosting.Server.Abstractions.dll"
  #Add-Type -Path "$($netCorePath)/System.IO.Pipelines.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.DependencyInjection.Abstractions.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Configuration.Abstractions.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.DependencyInjection.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Configuration.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Configuration.FileExtensions.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Configuration.EnvironmentVariables.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Configuration.Json.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Logging.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Logging.Configuration.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Logging.Console.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Options.dll"
  #Add-Type -Path "$($netCorePath)/Microsoft.Extensions.Configuration.Binder.dll"

  #Add-Type -Path "$($dllPath)/Amazon.Lambda.AspNetCoreServer.dll"
  #Add-Type -Path "$($dllPath)/AWSSDK.Core.dll"

  #Add-Type -Path "$($dllPath)/Amazon.Lambda.SNSEvents.dll"

  Add-Type -Path "$($dllPath)/Accounts.Models.EF3.dll"

  $assm = [System.Reflection.Assembly]::LoadFrom($dll)

  #$instance = New-Object -TypeName $handlerPath

  # Get the Handler method so we can determine the correct EventRequest type to use for deserializing event input
  $handlerMethod = $assm.GetType($handlerPath).GetMethod($handler)
  $handlerParams = $handlerMethod.GetParameters()

  # Create a fake to use for passing Type to DeserializeObject
  $fake = New-Object FakeLambdaContext

  # Deserialize param data
  $eventObj = [Newtonsoft.Json.JsonConvert]::DeserializeObject($eventInput, $handlerParams[0].ParameterType)
  $contextObj = [Newtonsoft.Json.JsonConvert]::DeserializeObject($context, $fake.GetType())

  $instance = [Activator]::CreateInstance($handlerPath)

  # Call the method on the Handler class instance
  $responseTask = $instance.$handler($eventObj, $contextObj)
  $response = $responseTask.GetAwaiter().GetResult()

  # Return the result Body
  Write-Host "{""__offline_payload__"":$($response.Body)}"
} catch {
  Write-Host "Message: [$($_.Exception.Message)]"
  Write-Host "Stack: $($_.Exception)"
  # Write-Host "InnerException Stack: $($_.Exception.InnerException)"
}

