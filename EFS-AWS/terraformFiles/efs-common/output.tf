output "efs_id" {
  value = aws_efs_file_system.efs_creation.id
}

data "aws_vpcs" "all_vpcs" {}

output "available_vpcs" {
  value = data.aws_vpcs.all_vpcs.ids
}

output "subnet_ids" {
  value = data.aws_subnet.subnet_ids[*].id
}
