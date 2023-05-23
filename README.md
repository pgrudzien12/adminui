# OSDU Admin UI Web App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli). This application uses Angular version 13.3.9

Source files are located in OSDUApp folder. For each following command, you may need to execute them in this folder.

## Configuration file

This application uses informations in json files located in src\config folder.

Here are the informations you will have to provide :

```json
{

	...
	"data_partition": "osdu_data_partition",
	"idp": {
		...
		"tenant_id": "tenant_id",
		"client_id": "client_id",
		"redirect_uri": "redirect_uri",
		"scope": "scope"
	},
	"api_endpoints": {
		"entitlement_endpoint": "entitlement_endpoint",
		"storage_endpoint": "storage_endpoint",
		"search_endpoint": "search_endpoint",
		"legal_endpoint": "legal_endpoint",
		"schema_endpoint": "schema_endpoint",
		"osdu_connector_api_endpoint":"osdu_connector_api_endpoint",
		"file_endpoint": "file_endpoint",
		"graphAPI_endpoint": "graphAPI_endpoint",
		"workflow_endpoint": "workflow_endpoint"
	}
	...
}
```

## Prerequisites

You need to install Node.JS (https://nodejs.org/). This web application has been tested on Node.JS v14.17.3

Once node is installed on your computer, run `npm install`.

## Cloud Provider

This application is designed to work with Microsoft Azure. If you want to use another cloud provider you will have to make modifications.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Code Linting

ESLint linter (https://eslint.org/) is available. Run `ng lint` to analyze code.

## Code formatting

Prettier (https://prettier.io/) is used as a code formatter. Run `npx prettier --write .` to format code.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
