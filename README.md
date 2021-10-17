# Cloud Platform Template

## !Experimental! ##

This is a template for a cloud based platform using a hybrid of Microservices and Serverless based back end. The system is built using C# [.NET Core](https://github.com/dotnet/core) and TypeScript as the primary languages where C# and TypeScript are used for Serverless functions, C# is used for Microservices, and TypeScript is used with a [VueJs](https://github.com/vuejs/vue) front end.

This setup provides a full local development environment with AWS services running locally using [VSCode Dev Containers](https://code.visualstudio.com/docs/remote/create-dev-container) or [GitHub Codespaces](https://github.com/features/codespaces).

The template currently includes a Vue2 client and two services (User and WebSockets). 

### Steps to use

1. Fork this repository
2. Open in VSCode Dev Container or GitHub Codespaces
3. Forward ports (see below)

### Overview

This repository is intended to be used as the top level folder while developing in VSCode. This top level repository uses [Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) for all referenced projects/packages/components. 

The main structure of the repo is:

```
├── .devcontainer
├── dotnet
├── packages
├── services
└── submodules
```

#### .devcontainer
This directory contains VS Code development container files as well as additional scripts and resources used for running the full platform stack locally using Serverless Offline.

#### dotnet
Git Submodule for shared .NET Core projects. Repo located at https://github.com/kfinley/cloud-platform-dotnet

#### packages
This directory contains any shared TypeScript projects/submodules as well as front end client packages.

### services
This directory contains any back end services. These are logically grouped services written in C# running as a .net core api (microservice) in a container or serverless functions written in C# or TypeScript. Additional languages, frameworks, etc. could be used for additional services added to the platform.

### Front End - VueJs / Vuex / TypeScript / Storybooks
The front end is built as a component based system using VueJs 2, Vuex, Bootstrap 5, TypeScript, Jest, and Storybooks.

Features are built as Vue components grouped by domain and built as seperate Vue plugins. These plugins are loaded into a Vue client.

Jest is used for unit testing of Vue UI components, Vuex store modules, and shared packages.

[Storybooks](http://storybook.js.org) are used for design, development, testing, and review of all individual UX components.

### Back End - TypeScript & C#
The back end is built using serverless and container based APIs using TypeScript and C# dotnet core.

At a high level the back end looks like this...

* Lambda : TypeScript & C#
* REST APIs : C#
* WebSockets : TypeScript
* Messaging : SNS / SES
* Serverless Orchestration : AWS Step Functions
* Data : S3, MySql, DynamoDB
* Auth : Cognito

### Local Development

In order to have a close match between Production and Development code execution paths all cloud based process flows and systems are run locally using various open source projects and AWS provided components.

The back end systems are run in containers as either dotnet core 5.0 based APIs, AWS service stand-ins, or using Serverless Offline to memic AWS Lambda, API Gateway, and other required services.

##### Serverless Offline
A [customized version of Serverless Offline](https://github.com/kfinley/serverless-offline) that has dotnet core Lambda Function execution support is being used and is referenced as a Git Submodule.

A container (cloud-platform.sls) is configured to run the platform locally. The platform is defined using serverless.yml and various cloud resource files located in each service directory (more info below).

Serverless is configured to use several plugins:
- [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack)
- [serverless-dynamodb-local](https://github.com/99x/serverless-dynamodb-local)
- [serverless-offline-sns](https://github.com/mj1618/serverless-offline-sns)
- [serverless-s3-local](https://github.com/ar90n/serverless-s3-local)
- [serverless-step-functions](https://github.com/serverless-operations/serverless-step-functions)
- [serverless-offline-stepfunctions-plugin](https://github.com/pianomansam/serverless-offline-stepfunctions-plugin)
- [serverless-offline](https://github.com/dherault/serverless-offline)

A [customized version of cognito-local](https://github.com/kfinley/cognito-local) is being used and is referenced as a git submodule.

A [customized version of aws-ses-local](https://github.com/kfinley/aws-ses-local) is being used and is referenced as a git submodule.

In addition to a container running Serverless Offline there are several other containers running as stand ins for AWS services. These include:
- cloud-platform.cognito (Cognito : Auth)
- cloud-platform.ses (Simple Email Services)
- cloud-platform.sfn (AWS Step Functions)
- cloud-platform.dynamodb (AWS DynamoDB)
- cloud-platform.dynamodb.admin (DynamoDB Admin Console)
- cloud-platform.mysql (AWS RDS)

The front end Vue client is run in a container (cloud-platform.web) using [Vite](https://github.com/vitejs/vite).

##### TypeScript package management
[Lerna](https://github.com/lerna/lerna) is used to manage package code sharing across all javascript based projects.

This includes packages located under the `packages` and `services` folders.

##### .net core debugging
Each .net based service is running in a seperate container that can be attached to for debugging. There are VSCode tasks configured to attach each service to it's corresponding container. More info on attaching to a remote container can be found [here](https://code.visualstudio.com/docs/remote/attach-container).

These containers are not currently set to auto restart on changes so the container must be restarted and debugger reattached after code is modified.

Each service can also be launched locally. In this case stop the container running the service then select the desired 'Launch #SERVICE_NAME# Api' VSCode task.

#### Services Cloud Config
Each service has it's resources defined in various files located under an `infrastructure` folder.

These files include:
```
├── environment.yml
├── functions.yml
├── resources.yml
└── stateMachines.yml
```

##### environment.yml
Contains environment variables to be loaded for any Lambda Function or container.

##### functions.yml
Contains service Lambda Function definitions

##### resources.yml
Contains cloud resource definitions such as DynamoDB Tables, SNS Topics/Subscriptions, S3 buckets, etc.

##### stateMachines.yml
Contains AWS StepFunction definitions

### Storybooks
Each Vue plugin package has it's own [Storybook](https://github.com/storybookjs/storybook) configured.

Storybooks are deployed to GitHub pages for the main branch and any Pull Request that is created. This is handled by GitHub Actions.

During local development a specific storybook can be run in order to be viewed in the browser or preview in VSCode using [VSCode Story Explorer](https://github.com/joshbolduc/vscode-story-explorer)

A container is built (cloud-platform.storybooks) that runs a combined static instance of all the storybooks using [Storybook Deployer](https://github.com/storybookjs/storybook-deployer) and the monorepo option.

### GitHub Codespaces Port Forwarding
When running on GitHub Codespaces port forwarding must be configured manually.

Ports:
* 3001 - WebSockets
* 4569 - S3
* 5000 - User API
* 8001 - DynamoDb Admin
* 8080 - Vue Web Client
* 9229 - Cognito