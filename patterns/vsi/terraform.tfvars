TF_VERSION                       = "1.0"
prefix                           = "< add user data here >"
region                           = "< add user data here >"
ssh_public_key                   = "< add user data here >"
tags                             = []
network_cidr                     = "10.0.0.0/8"
vpcs                             = ["managemnet", "workload"]
enable_transit_gateway           = true
add_atracker_route               = true
hs_crypto_instance_name          = null
hs_crypto_resource_group         = null
vsi_image_name                   = "ibm-ubuntu-18-04-6-minimal-amd64-2"
vsi_instance_profile             = "cx2-4x8"
vsi_per_subnet                   = 1
add_edge_vpc                     = false
create_bastion_on_management_vpc = false
vpn_firewall_type                = null
f5_image_name                    = "f5-bigip-15-1-2-1-0-0-10-all-1slot-1"
f5_instance_profile              = "cx2-4x8"
hostname                         = "f5-ve-01"
domain                           = "local"
default_route_interface          = null
tmos_admin_password              = null
license_type                     = "none"
byol_license_basekey             = null
license_host                     = null
license_username                 = null
license_password                 = null
license_pool                     = null
license_sku_keyword_1            = null
license_sku_keyword_2            = null
license_unit_of_measure          = "hourly"
do_declaration_url               = null
as3_declaration_url              = null
ts_declaration_url               = null
phone_home_url                   = null
template_source                  = "f5devcentral/ibmcloud_schematics_bigip_multinic_declared"
template_version                 = "20210201"
app_id                           = null
tgactive_url                     = ""
tgstandby_url                    = null
tgrefresh_url                    = null
enable_f5_management_fip         = false
enable_f5_external_fip           = false
override                         = false