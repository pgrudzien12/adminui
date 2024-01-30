variable "environment" {
  description = "Deployment environment like prod, staging, dev, etc."
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region for deployment."
  type        = string
  default     = "westeurope"
}
