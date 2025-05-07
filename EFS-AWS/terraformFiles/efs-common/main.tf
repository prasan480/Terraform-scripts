# Define the VPC ID
locals {
  selected_vpc_id    = length(data.aws_vpcs.vpc_id.ids) > 0 ? data.aws_vpcs.vpc_id.ids[0] : null
  selected_subnet_id = length(data.aws_subnet.subnet_ids) > 0 ? data.aws_subnet.subnet_ids[0].id : null
}

data "aws_vpcs" "vpc_id" {
  filter {
    name   = "tag:Name"
    values = length(var.aws_vpc) > 0 ? [var.aws_vpc] : []
  }
}

data "aws_subnet" "subnet_ids" {
  count  = local.selected_vpc_id != null ? 1 : 0
  vpc_id = local.selected_vpc_id

  filter {
    name   = "tag:Name"
    values = length(var.aws_subnet_id) > 0 ? var.aws_subnet_id : []
  }
}

# Get Security Groups
data "aws_security_groups" "security_group" {
  count = length(data.aws_vpcs.vpc_id.ids) > 0 ? 1 : 0

  filter {
    name   = "vpc-id"
    values = [data.aws_vpcs.vpc_id.ids[0]]
  }

  filter {
    name   = "group-name"
    values = ["default", "*-SAP-APP", "*-APP-SERVER*", "*-FileShare*", "*_app"]
  }
}

# Get Default Security Group
data "aws_security_group" "default_security_group" {
  count = length(data.aws_vpcs.vpc_id.ids) > 0 ? 1 : 0
  
  filter {
    name   = "vpc-id"
    values = [data.aws_vpcs.vpc_id.ids[0]]
  }

  filter {
    name   = "tag:default"
    values = var.default_sg
  }
}

# Create EFS
resource "aws_efs_file_system" "efs_creation" {
  performance_mode = "generalPurpose"
  throughput_mode  = "bursting"
  creation_token   = format("EFS%s", var.efs_name)

  lifecycle {
    prevent_destroy = false
  }

  tags = {
    Name        = "EFS${var.efs_name}"
    Application = var.efs_name
  }
}

resource "aws_efs_mount_target" "efs_mounts" {
  count           = local.selected_subnet_id != null ? 1 : 0
  file_system_id  = aws_efs_file_system.efs_creation.id
  subnet_id       = local.selected_subnet_id
  # security_groups = [data.aws_security_groups.security_group[0].id]
}

# Ensure Terraform destroys Mount Target first
# resource "aws_efs_mount_target" "mount_target_delete" {
#   count          = terraform.workspace == "destroy" ? 1 : 0
#   file_system_id = aws_efs_file_system.efs_creation.id
#   subnet_id = var.aws_subnet_id[0]
# }
