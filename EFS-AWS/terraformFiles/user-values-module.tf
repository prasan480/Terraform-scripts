module "user_module" {
  source                 = "./efs-common"
  sap_id                 = ${sap_id}
  aws_region             = ${region}
  aws_vpc                = ${aws_vpc}
  aws_subnet_id          = ${aws_subnet_id}
  efs_name               = ${efs_name}
}
