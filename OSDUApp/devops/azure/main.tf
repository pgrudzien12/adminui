provider "azurerm" {
  features {}
}

module "naming" {
  source  = "Azure/naming/azurerm"
  prefix = [ "osduadminui" ]
}

resource "azurerm_resource_group" "rg" {
  name     = "osdu-admin-ui-${var.environment}-rg"
  location = var.location
}

resource "azurerm_storage_account" "storage" {
  name                            = module.naming.storage_account.name_unique
  resource_group_name             = azurerm_resource_group.rg.name
  location                        = var.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = false

  static_website {
    index_document     = "index.html"
    error_404_document = "404.html"
  }

  tags = {
    environment = var.environment
  }
}
