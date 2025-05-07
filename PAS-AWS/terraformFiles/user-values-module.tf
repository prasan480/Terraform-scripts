module "user_module" {
  source                 = "./pas-common"
  instance_name          = ${application_name}
  instance_type_pas      = ${instanceType}
  instance_profile       = ${instance_profile}
  user                   = ${user}
  ami_id                 = ${ami}
  sap_sid                = ${sap_sid}
  IAC_org                = "SystemAdministrator"
  sap_id                 = ${sap_id}
  region                 = ${region}
  aws_vpc                = ${aws_vpc}
  aws_subnet_id          = ${aws_subnet_id}
}
