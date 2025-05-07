module "IAC_TFT" {
  source                     = "./wd-common"
  application_name           = ${application_name}
  instance_profile           = ${instance_profile}
  sap_sid                    = ${sap_sid}
  wd_count                   = ${as_count}
  user                       = ${user}
  IAC_org                    = "SystemAdministrator"
  instance_type_wd           = ${instanceType}
  wd_ami                     = ${ami}
  sap_id                     = ${sap_id}
  region                     = ${region}
  aws_vpc                    = ${aws_vpc}
  aws_subnet_id              = ${aws_subnet_id}
}
