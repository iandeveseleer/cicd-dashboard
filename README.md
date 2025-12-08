# CI/CD Dashboard (WIP)

This project aim to provide a comprehensive dashboard for monitoring and managing Continuous Integration and Continuous Deployment (CI/CD) pipelines. It offers real-time insights into build statuses, deployment progress, and other critical metrics to help development teams streamline their workflows.

It's frontend of a larger system designed to enhance the CI/CD experience.
To make it fully functional, it needs to be integrated with a backend service that collects and processes CI/CD data. **(WIP)**

## Features

- Monitoring of CI/CD pipelines
- Visual representation of build and deployment statuses
- Integration with Gitlab CI/CD tools (other tools coming soon)
- Customizable dashboards and widgets

## Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.2.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```
