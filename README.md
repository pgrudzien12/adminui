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

### Azure Deployment

Find deployment instructions and templates [here](/OSDUApp/devops/azure/README.md).

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



# Permissions & Consent
For the software to function properly, it requires certain permissions via the Microsoft Graph API.

### User.Read

__Description__: Allows the app to sign in the user and read the profile of signed-in users. It includes their username, display name, profile photo and email address.

### User.ReadBasic.All

__Description__: Allows the app to read the basic profile of all users in the organization on behalf of the signed-in user. This includes display names, user principal names, and office location. It does not allow for access to personal data, such as emails or phone numbers.

### Application.Read.All

__Description__: Allows the app to read the full details of all applications, service principals, and related service principal names (SPN) in the directory.

__Important__: This permission requires _Admin Consent_. Hence, an Administrator of the organization needs to grant this permission for the software to access the data it needs.
Please ensure that you have these permissions set up correctly. If you're an administrator, be aware that the Application.Read.All permission requires your explicit consent for the software to function as intended.

If you still want to test the software without admin consent please go to `environment.ts` file and remove the permission. This will result in autocomplete (and possibly other functions) not working properly.

