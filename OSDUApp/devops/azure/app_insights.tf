resource "azurerm_application_insights" "ai" {
  name                = "osdu-admin-ui-${var.environment}-insights"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
  
  tags = {
    environment = var.environment
  }
}
