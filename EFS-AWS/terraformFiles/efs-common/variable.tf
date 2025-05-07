# variable "efs_id" {}



variable "aws_region" {
  type    = string
  description = "Provide the AWS region"
  default = "us-east-1"
}

variable "aws_vpc" {
  type        = string
  description = "For the desired VPC or private VPC"
  default     = "vpc-036268133895cbb5a"
}

variable "aws_subnet_id" {
  type        = list(string)
  description = "For the subnets thats comes under the desired VPC"
  default     = ["subnet-06b04478c693753f9"]
}

variable "default_sg" {
  type = list(string)
  default = ["sg-05e2629c8efe48e20"]
}

variable "efs_name" {
  type        = string
  description = "EFS name variable for the SAP system"
}

variable "sap_id" {
  type        = string
  description = "UNIQUE ID for the SAP system"
}
