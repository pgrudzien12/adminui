# Deploying Terraform Infrastructure & Setting Up Azure DevOps Pipeline

This guide will walk you through the process of deploying infrastructure using Terraform and setting up a CI/CD pipeline in Azure DevOps.

## Prerequisites

- An active Azure account.
- An active Azure DevOps account.
- Familiarity with Azure resources and Terraform.
- Terraform scripts for your infrastructure.
- Updated config file (/OSDUApp/src/config) for the relevant environment with the values for your Entra ID and OSDU or ADME instance.

## 1. Deploying Terraform

### 1.1. Set Up Terraform

Ensure you have Terraform installed on your machine. If not, download and install it from the [official site](https://www.terraform.io/downloads.html).

### 1.2. Terraform Configuration

Navigate to your Terraform script's directory:

```bash
cd path/to/your/terraform/scripts
```

Initialize Terraform:

```bash
terraform init
```

Review the changes Terraform will make:

```bash
terraform plan
```

Deploy the infrastructure:

```bash
terraform apply
```

## 2. Setting Up Azure DevOps Pipeline

### 2.1. Push Your Code to Azure Repos

If you haven't already, push your codebase, including your Terraform scripts and Angular application, to an Azure DevOps Repo.

### 2.2. Create a New Pipeline

1. In Azure DevOps, navigate to `Pipelines` > `New Pipeline`.
2. Choose the Azure Repo where your code resides.
3. Select `Existing Azure Pipelines YAML file` and choose your YAML file's path.

### 2.3. Define Secrets and Variables

1. Navigate to the `Pipeline` settings.
2. Under the `Variables` tab, define the required variables and secrets (e.g., `API_ENDPOINT`, `API_KEY`). If they are sensitive, ensure you mark them as secrets to keep them hidden.

### 2.4. Run the Pipeline

With everything set up, trigger the pipeline to run, either by pushing a change to the monitored branches (e.g., `main`) or manually running it from Azure DevOps.

### 2.5. Monitor & Debug

- Monitor the pipeline run in Azure DevOps, ensuring each step completes successfully.
- If any errors arise, Azure DevOps provides logs for each step, which will aid in troubleshooting.