require("dotenv").config();
const tfxjs = require("tfxjs");
const tfx = new tfxjs("./patterns/bastion-on-management", "ibmcloud_api_key", {
  quiet: true,
});

tfx.plan("Bastion on Management", () => {

  tfx.module(
    "Landing Zone",
    "module.acceptance_tests.module.landing-zone",
    tfx.resource("Atracker Route", "ibm_atracker_route.atracker_route[0]", {
      name: "at-test-atracker-route",
      receive_global_events: true,
      rules: [{}],
    }),
    tfx.resource("Atracker Target", "ibm_atracker_target.atracker_target", {
      cos_endpoint: [
        {
          bucket: "at-test-atracker-bucket",
          endpoint: "s3.private.us-south.cloud-object-storage.appdomain.cloud",
        },
      ],
      name: "at-test-atracker",
      target_type: "cloud_object_storage",
    }),
    tfx.resource("Buckets", 'ibm_cos_bucket.buckets["atracker-bucket"]', {
      abort_incomplete_multipart_upload_days: [],
      activity_tracking: [],
      archive_rule: [],
      bucket_name: "at-test-atracker-bucket",
      endpoint_type: "public",
      expire_rule: [],
      force_delete: true,
      metrics_monitoring: [],
      noncurrent_version_expiration: [],
      object_versioning: [],
      region_location: "us-south",
      retention_rule: [],
      storage_class: "standard",
    }),
    tfx.resource("Buckets", 'ibm_cos_bucket.buckets["management-bucket"]', {
      abort_incomplete_multipart_upload_days: [],
      activity_tracking: [],
      archive_rule: [],
      bucket_name: "at-test-management-bucket",
      endpoint_type: "public",
      expire_rule: [],
      force_delete: true,
      metrics_monitoring: [],
      noncurrent_version_expiration: [],
      object_versioning: [],
      region_location: "us-south",
      retention_rule: [],
      storage_class: "standard",
    }),
    tfx.resource("Buckets", 'ibm_cos_bucket.buckets["workload-bucket"]', {
      abort_incomplete_multipart_upload_days: [],
      activity_tracking: [],
      archive_rule: [],
      bucket_name: "at-test-workload-bucket",
      endpoint_type: "public",
      expire_rule: [],
      force_delete: true,
      metrics_monitoring: [],
      noncurrent_version_expiration: [],
      object_versioning: [],
      region_location: "us-south",
      retention_rule: [],
      storage_class: "standard",
    }),
    tfx.resource(
      "Policy",
      'ibm_iam_authorization_policy.policy["block-storage"]',
      {
        description:
          "Allow block storage volumes to be encrypted by KMS instance",
        roles: ["Reader"],
        source_service_name: "server-protect",
        target_service_name: "kms",
      }
    ),
    tfx.resource(
      "Policy",
      'ibm_iam_authorization_policy.policy["cos-atracker-cos-to-key-management"]',
      {
        description: "Allow COS instance to read from KMS instance",
        roles: ["Reader"],
        source_service_name: "cloud-object-storage",
        target_service_name: "kms",
      }
    ),
    tfx.resource(
      "Policy",
      'ibm_iam_authorization_policy.policy["cos-cos-to-key-management"]',
      {
        description: "Allow COS instance to read from KMS instance",
        roles: ["Reader"],
        source_service_name: "cloud-object-storage",
        target_service_name: "kms",
      }
    ),
    tfx.resource(
      "Policy",
      'ibm_iam_authorization_policy.policy["flow-logs-atracker-cos-cos"]',
      {
        description:
          "Allow flow logs write access cloud object storage instance",
        roles: ["Writer"],
        source_resource_type: "flow-log-collector",
        source_service_name: "is",
        target_service_name: "cloud-object-storage",
      }
    ),
    tfx.resource(
      "Policy",
      'ibm_iam_authorization_policy.policy["flow-logs-cos-cos"]',
      {
        description:
          "Allow flow logs write access cloud object storage instance",
        roles: ["Writer"],
        source_resource_type: "flow-log-collector",
        source_service_name: "is",
        target_service_name: "cloud-object-storage",
      }
    ),
    tfx.resource("Flow Logs", 'ibm_is_flow_log.flow_logs["management"]', {
      active: true,
      name: "management-logs",
      storage_bucket: "at-test-management-bucket",
    }),
    tfx.resource("Flow Logs", 'ibm_is_flow_log.flow_logs["workload"]', {
      active: true,
      name: "workload-logs",
      storage_bucket: "at-test-workload-bucket",
    }),
    tfx.resource(
      "Security Group",
      'ibm_is_security_group.security_group["f5-bastion-sg"]',
      {
        name: "f5-bastion-sg",
        tags: ["acceptance-test", "landing-zone"],
      }
    ),
    tfx.resource(
      "Security Group",
      'ibm_is_security_group.security_group["f5-external-sg"]',
      {
        name: "f5-external-sg",
        tags: ["acceptance-test", "landing-zone"],
      }
    ),
    tfx.resource(
      "Security Group",
      'ibm_is_security_group.security_group["f5-management-sg"]',
      {
        name: "f5-management-sg",
        tags: ["acceptance-test", "landing-zone"],
      }
    ),
    tfx.resource(
      "Security Group",
      'ibm_is_security_group.security_group["f5-workload-sg"]',
      {
        name: "f5-workload-sg",
        tags: ["acceptance-test", "landing-zone"],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-bastion-sg-allow-zone-1-inbound-3023"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 3023,
            port_min: 3025,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-bastion-sg-allow-zone-1-inbound-3080"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 3080,
            port_min: 3080,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-bastion-sg-allow-zone-2-inbound-3023"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 3023,
            port_min: 3025,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-bastion-sg-allow-zone-2-inbound-3080"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 3080,
            port_min: 3080,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-bastion-sg-allow-zone-3-inbound-3023"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 3023,
            port_min: 3025,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-bastion-sg-allow-zone-3-inbound-3080"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 3080,
            port_min: 3080,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-external-sg-allow-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "0.0.0.0/0",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-allow-bastion-1-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-allow-bastion-1-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-allow-bastion-2-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-allow-bastion-2-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-allow-bastion-3-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-allow-bastion-3-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-workload-sg-allow-workload-subnet-1"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.10.10.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-workload-sg-allow-workload-subnet-2"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.20.10.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-workload-sg-allow-workload-subnet-3"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.30.10.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-workload-sg-allow-workload-subnet-4"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.40.10.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-workload-sg-allow-workload-subnet-5"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.50.10.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-workload-sg-allow-workload-subnet-6"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.60.10.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Ip",
      'ibm_is_subnet_reserved_ip.ip["management-cos-gateway-vpe-zone-1-ip"]',
      {}
    ),
    tfx.resource(
      "Ip",
      'ibm_is_subnet_reserved_ip.ip["management-cos-gateway-vpe-zone-2-ip"]',
      {}
    ),
    tfx.resource(
      "Ip",
      'ibm_is_subnet_reserved_ip.ip["management-cos-gateway-vpe-zone-3-ip"]',
      {}
    ),
    tfx.resource(
      "Ip",
      'ibm_is_subnet_reserved_ip.ip["workload-cos-gateway-vpe-zone-1-ip"]',
      {}
    ),
    tfx.resource(
      "Ip",
      'ibm_is_subnet_reserved_ip.ip["workload-cos-gateway-vpe-zone-2-ip"]',
      {}
    ),
    tfx.resource(
      "Ip",
      'ibm_is_subnet_reserved_ip.ip["workload-cos-gateway-vpe-zone-3-ip"]',
      {}
    ),
    tfx.resource(
      "Endpoint Gateway",
      'ibm_is_virtual_endpoint_gateway.endpoint_gateway["management-cos"]',
      {
        name: "at-test-management-cos",
        target: [
          {
            crn: "crn:v1:bluemix:public:cloud-object-storage:global:::endpoint:s3.direct.us-south.cloud-object-storage.appdomain.cloud",
            name: null,
            resource_type: "provider_cloud_service",
          },
        ],
      }
    ),
    tfx.resource(
      "Endpoint Gateway",
      'ibm_is_virtual_endpoint_gateway.endpoint_gateway["workload-cos"]',
      {
        name: "at-test-workload-cos",
        target: [
          {
            crn: "crn:v1:bluemix:public:cloud-object-storage:global:::endpoint:s3.direct.us-south.cloud-object-storage.appdomain.cloud",
            name: null,
            resource_type: "provider_cloud_service",
          },
        ],
      }
    ),
    tfx.resource(
      "Endpoint Gateway Ip",
      'ibm_is_virtual_endpoint_gateway_ip.endpoint_gateway_ip["management-cos-gateway-vpe-zone-1-ip"]',
      {}
    ),
    tfx.resource(
      "Endpoint Gateway Ip",
      'ibm_is_virtual_endpoint_gateway_ip.endpoint_gateway_ip["management-cos-gateway-vpe-zone-2-ip"]',
      {}
    ),
    tfx.resource(
      "Endpoint Gateway Ip",
      'ibm_is_virtual_endpoint_gateway_ip.endpoint_gateway_ip["management-cos-gateway-vpe-zone-3-ip"]',
      {}
    ),
    tfx.resource(
      "Endpoint Gateway Ip",
      'ibm_is_virtual_endpoint_gateway_ip.endpoint_gateway_ip["workload-cos-gateway-vpe-zone-1-ip"]',
      {}
    ),
    tfx.resource(
      "Endpoint Gateway Ip",
      'ibm_is_virtual_endpoint_gateway_ip.endpoint_gateway_ip["workload-cos-gateway-vpe-zone-2-ip"]',
      {}
    ),
    tfx.resource(
      "Endpoint Gateway Ip",
      'ibm_is_virtual_endpoint_gateway_ip.endpoint_gateway_ip["workload-cos-gateway-vpe-zone-3-ip"]',
      {}
    ),
    tfx.resource(
      "Resource Groups",
      'ibm_resource_group.resource_groups["at-test-management-rg"]',
      {
        name: "at-test-management-rg",
      }
    ),
    tfx.resource(
      "Resource Groups",
      'ibm_resource_group.resource_groups["at-test-service-rg"]',
      {
        name: "at-test-service-rg",
      }
    ),
    tfx.resource(
      "Resource Groups",
      'ibm_resource_group.resource_groups["at-test-workload-rg"]',
      {
        name: "at-test-workload-rg",
      }
    ),
    tfx.resource("Cos", 'ibm_resource_instance.cos["atracker-cos"]', {
      location: "global",
      name: "at-test-atracker-cos",
      plan: "standard",
      service: "cloud-object-storage",
      tags: ["acceptance-test", "landing-zone"],
    }),
    tfx.resource("Cos", 'ibm_resource_instance.cos["cos"]', {
      location: "global",
      name: "at-test-cos",
      plan: "standard",
      service: "cloud-object-storage",
      tags: ["acceptance-test", "landing-zone"],
    }),
    tfx.resource("Key", 'ibm_resource_key.key["cos-bind-key"]', {
      name: "at-test-cos-bind-key",
      role: "Writer",
      tags: ["acceptance-test", "landing-zone"],
    }),
    tfx.resource("Connection", 'ibm_tg_connection.connection["management"]', {
      name: "at-test-management-hub-connection",
      network_type: "vpc",
      timeouts: {
        create: "30m",
        delete: "30m",
        update: null
      },
    }),
    tfx.resource("Connection", 'ibm_tg_connection.connection["workload"]', {
      name: "at-test-workload-hub-connection",
      network_type: "vpc",
      timeouts: {
        create: "30m",
        delete: "30m",
        update: null
      },
    }),
    tfx.resource("Transit Gateway", "ibm_tg_gateway.transit_gateway[0]", {
      global: false,
      location: "us-south",
      name: "at-test-transit-gateway",
      timeouts: {
        create: "30m",
        delete: "30m",
        update: null
      },
    })
  );

  tfx.module(
    "Vpc Management",
    'module.acceptance_tests.module.landing-zone.module.vpc["management"]',
    tfx.resource(
      "Network Acl",
      'ibm_is_network_acl.network_acl["management-acl"]',
      {
        name: "at-test-management-management-acl",
        rules: [
          {
            action: "allow",
            destination: "10.0.0.0/8",
            direction: "inbound",
            icmp: [],
            name: "allow-ibm-inbound",
            source: "161.26.0.0/16",
            tcp: [],
            udp: [],
          },
          {
            action: "allow",
            destination: "10.0.0.0/8",
            direction: "inbound",
            icmp: [],
            name: "allow-all-network-inbound",
            source: "10.0.0.0/8",
            tcp: [],
            udp: [],
          },
          {
            action: "allow",
            destination: "0.0.0.0/0",
            direction: "outbound",
            icmp: [],
            name: "allow-all-outbound",
            source: "0.0.0.0/0",
            tcp: [],
            udp: [],
          },
        ],
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-bastion-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.5.70.0/24",
        name: "at-test-management-bastion-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-bastion-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.6.70.0/24",
        name: "at-test-management-bastion-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-bastion-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.7.70.0/24",
        name: "at-test-management-bastion-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-bastion-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.5.60.0/24",
        name: "at-test-management-f5-bastion-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-bastion-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.6.60.0/24",
        name: "at-test-management-f5-bastion-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-bastion-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.7.60.0/24",
        name: "at-test-management-f5-bastion-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-external-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.5.40.0/24",
        name: "at-test-management-f5-external-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-external-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.6.40.0/24",
        name: "at-test-management-f5-external-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-external-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.7.40.0/24",
        name: "at-test-management-f5-external-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-management-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.5.30.0/24",
        name: "at-test-management-f5-management-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-management-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.6.30.0/24",
        name: "at-test-management-f5-management-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-management-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.7.30.0/24",
        name: "at-test-management-f5-management-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-workload-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.5.50.0/24",
        name: "at-test-management-f5-workload-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-workload-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.6.50.0/24",
        name: "at-test-management-f5-workload-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-f5-workload-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.7.50.0/24",
        name: "at-test-management-f5-workload-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vpe-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.5.80.0/24",
        name: "at-test-management-vpe-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vpe-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.6.80.0/24",
        name: "at-test-management-vpe-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vpe-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.7.80.0/24",
        name: "at-test-management-vpe-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vpn-1-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.5.10.0/24",
        name: "at-test-management-vpn-1-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vpn-1-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.6.10.0/24",
        name: "at-test-management-vpn-1-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vpn-1-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.7.10.0/24",
        name: "at-test-management-vpn-1-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vpn-2-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.5.20.0/24",
        name: "at-test-management-vpn-2-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vpn-2-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.6.20.0/24",
        name: "at-test-management-vpn-2-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vpn-2-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.7.20.0/24",
        name: "at-test-management-vpn-2-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vsi-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.10.10.0/24",
        name: "at-test-management-vsi-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vsi-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.20.10.0/24",
        name: "at-test-management-vsi-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-management-vsi-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.30.10.0/24",
        name: "at-test-management-vsi-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource("Vpc", "ibm_is_vpc.vpc", {
      address_prefix_management: "manual",
      classic_access: false,
      name: "at-test-management-vpc",
    }),
    tfx.resource(
      "Address Prefixes",
      'ibm_is_vpc_address_prefix.address_prefixes["at-test-management-zone-1-1"]',
      {
        cidr: "10.5.0.0/16",
        is_default: false,
        name: "at-test-management-zone-1-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Address Prefixes",
      'ibm_is_vpc_address_prefix.address_prefixes["at-test-management-zone-1-2"]',
      {
        cidr: "10.10.10.0/24",
        is_default: false,
        name: "at-test-management-zone-1-2",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Address Prefixes",
      'ibm_is_vpc_address_prefix.address_prefixes["at-test-management-zone-2-1"]',
      {
        cidr: "10.6.0.0/16",
        is_default: false,
        name: "at-test-management-zone-2-1",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Address Prefixes",
      'ibm_is_vpc_address_prefix.address_prefixes["at-test-management-zone-2-2"]',
      {
        cidr: "10.20.10.0/24",
        is_default: false,
        name: "at-test-management-zone-2-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Address Prefixes",
      'ibm_is_vpc_address_prefix.address_prefixes["at-test-management-zone-3-1"]',
      {
        cidr: "10.7.0.0/16",
        is_default: false,
        name: "at-test-management-zone-3-1",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Address Prefixes",
      'ibm_is_vpc_address_prefix.address_prefixes["at-test-management-zone-3-2"]',
      {
        cidr: "10.30.10.0/24",
        is_default: false,
        name: "at-test-management-zone-3-2",
        zone: "us-south-3",
      }
    )
  );

  tfx.module(
    "Vpc Workload",
    'module.acceptance_tests.module.landing-zone.module.vpc["workload"]',
    tfx.resource(
      "Network Acl",
      'ibm_is_network_acl.network_acl["workload-acl"]',
      {
        name: "at-test-workload-workload-acl",
        rules: [
          {
            action: "allow",
            destination: "10.0.0.0/8",
            direction: "inbound",
            icmp: [],
            name: "allow-ibm-inbound",
            source: "161.26.0.0/16",
            tcp: [],
            udp: [],
          },
          {
            action: "allow",
            destination: "10.0.0.0/8",
            direction: "inbound",
            icmp: [],
            name: "allow-all-network-inbound",
            source: "10.0.0.0/8",
            tcp: [],
            udp: [],
          },
          {
            action: "allow",
            destination: "0.0.0.0/0",
            direction: "outbound",
            icmp: [],
            name: "allow-all-outbound",
            source: "0.0.0.0/0",
            tcp: [],
            udp: [],
          },
        ],
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-workload-vpe-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.40.20.0/24",
        name: "at-test-workload-vpe-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-workload-vpe-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.50.20.0/24",
        name: "at-test-workload-vpe-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-workload-vpe-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.60.20.0/24",
        name: "at-test-workload-vpe-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-workload-vsi-zone-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.40.10.0/24",
        name: "at-test-workload-vsi-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-workload-vsi-zone-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.50.10.0/24",
        name: "at-test-workload-vsi-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet",
      'ibm_is_subnet.subnet["at-test-workload-vsi-zone-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.60.10.0/24",
        name: "at-test-workload-vsi-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource("Vpc", "ibm_is_vpc.vpc", {
      address_prefix_management: "manual",
      classic_access: false,
      name: "at-test-workload-vpc",
    }),
    tfx.resource(
      "Subnet Prefix",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-test-workload-vpe-zone-1"]',
      {
        cidr: "10.40.20.0/24",
        is_default: false,
        name: "at-test-workload-vpe-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet Prefix",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-test-workload-vpe-zone-2"]',
      {
        cidr: "10.50.20.0/24",
        is_default: false,
        name: "at-test-workload-vpe-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet Prefix",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-test-workload-vpe-zone-3"]',
      {
        cidr: "10.60.20.0/24",
        is_default: false,
        name: "at-test-workload-vpe-zone-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet Prefix",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-test-workload-vsi-zone-1"]',
      {
        cidr: "10.40.10.0/24",
        is_default: false,
        name: "at-test-workload-vsi-zone-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet Prefix",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-test-workload-vsi-zone-2"]',
      {
        cidr: "10.50.10.0/24",
        is_default: false,
        name: "at-test-workload-vsi-zone-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet Prefix",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-test-workload-vsi-zone-3"]',
      {
        cidr: "10.60.10.0/24",
        is_default: false,
        name: "at-test-workload-vsi-zone-3",
        zone: "us-south-3",
      }
    )
  );

  tfx.module(
    "Key Management",
    "module.acceptance_tests.module.landing-zone.module.key_management",
    tfx.resource("Key", 'ibm_kms_key.key["at-test-atracker-key"]', {
      force_delete: true,
      key_name: "at-test-atracker-key",
      key_ring_id: "at-test-slz-ring",
      standard_key: false,
    }),
    tfx.resource("Key", 'ibm_kms_key.key["at-test-slz-key"]', {
      force_delete: true,
      key_name: "at-test-slz-key",
      key_ring_id: "at-test-slz-ring",
      standard_key: false,
    }),
    tfx.resource("Key", 'ibm_kms_key.key["at-test-vsi-volume-key"]', {
      force_delete: true,
      key_name: "at-test-vsi-volume-key",
      key_ring_id: "at-test-slz-ring",
      standard_key: false,
    }),
    tfx.resource("Rings", 'ibm_kms_key_rings.rings["at-test-slz-ring"]', {
      key_ring_id: "at-test-slz-ring",
    }),
    tfx.resource("Kms", "ibm_resource_instance.kms[0]", {
      location: "us-south",
      name: "at-test-slz-kms",
      plan: "tiered-pricing",
      service: "kms",
    })
  );

  tfx.module(
    "Ssh Keys",
    "module.acceptance_tests.module.landing-zone.module.ssh_keys",
    tfx.resource("Ssh Key", 'ibm_is_ssh_key.ssh_key["ssh-key"]', {
      name: "at-test-ssh-key",
      public_key: "<user defined>",
      tags: ["acceptance-test", "landing-zone"],
    })
  );

  tfx.module(
    "F5 Cloud Init At Test F5 Zone 3",
    'module.acceptance_tests.module.landing-zone.module.dynamic_values.module.f5_cloud_init["at-test-f5-zone-3"]',
    tfx.resource("User Data", "data.template_file.user_data", {
      template:
        "#cloud-config\nchpasswd:\n  expire: false\n  list: |\n    admin:${tmos_admin_password}\ntmos_dhcpv4_tmm:\n  enabled: true\n  rd_enabled: false\n  icontrollx_trusted_sources: false\n  inject_routes: true\n  configsync_interface: ${configsync_interface}\n  default_route_interface: ${default_route_interface}\n  dhcp_timeout: 120\n  dhcpv4_options:\n    mgmt:\n      host-name: ${hostname}\n      domain-name: ${domain}\n    '${default_route_interface}':\n      routers: ${default_route_gateway}\n  do_enabled: true \n  do_declaration: ${do_local_declaration}\n  do_declaration_url: ${do_declaration_url}\n  do_declaration_url_headers:\n    PRIVATE-TOKEN: x6VpQuWhiT_KgT3mzyTe\n  do_template_variables:\n    primary_dns: 8.8.8.8\n    secondary_dns: 1.1.1.1\n    timezone: Europe/Paris\n    primary_ntp: 132.163.96.5\n    secondary_ntp: 132.163.97.5\n    primary_radius: 10.20.22.20\n    primary_radius_secret: testing123\n    secondary_radius: 10.20.23.20\n    secondary_radius_secret: testing123\n  as3_enabled: true\n  as3_declaration_url: ${as3_declaration_url}\n  as3_declaration_url_headers:\n    PRIVATE-TOKEN: x6VpQuWhiT_KgT3mzyTe\n  as3_template_variables:\n    selfip_snat_address: 10.20.40.40\n  ts_enabled: true\n  ts_declaration_url: ${ts_declaration_url}\n  ts_declaration_url_headers:\n    PRIVATE-TOKEN: x6VpQuWhiT_KgT3mzyTe\n  ts_template_variables:\n    splunk_log_ingest: 10.20.23.30\n    splunk_password: 0f29e5dc-bee8-4898-9054-9b66574a3e14\n  phone_home_url: ${phone_home_url}\n  phone_home_url_verify_tls: false\n  phone_home_url_metadata:\n    template_source: ${template_source}\n    template_version: ${template_version}\n    zone: ${zone}\n    vpc: ${vpc}\n    app_id: ${app_id}\n  tgactive_url: ${tgactive_url}\n  tgstandby_url: ${tgstandby_url}\n  tgrefresh_url: ${tgrefresh_url}\n  ",
      vars: {
        app_id: "null",
        as3_declaration_url: "null",
        configsync_interface: "1.1",
        default_route_gateway: "10.7.50.1",
        default_route_interface: "1.3",
        do_declaration_url: "null",
        do_local_declaration: "null",
        domain: "f5-ve-01",
        hostname: "f5-ve-01",
        phone_home_url: "null",
        template_source:
          "f5devcentral/ibmcloud_schematics_bigip_multinic_declared",
        template_version: "20210201",
        tgactive_url: "",
        tgrefresh_url: "null",
        tgstandby_url: "null",
        tmos_admin_password: "null",
        ts_declaration_url: "null",
        zone: "us-south-3",
      },
    })
  );

  tfx.module(
    "F5 Cloud Init At Test F5 Zone 2",
    'module.acceptance_tests.module.landing-zone.module.dynamic_values.module.f5_cloud_init["at-test-f5-zone-2"]',
    tfx.resource("User Data", "data.template_file.user_data", {
      template:
        "#cloud-config\nchpasswd:\n  expire: false\n  list: |\n    admin:${tmos_admin_password}\ntmos_dhcpv4_tmm:\n  enabled: true\n  rd_enabled: false\n  icontrollx_trusted_sources: false\n  inject_routes: true\n  configsync_interface: ${configsync_interface}\n  default_route_interface: ${default_route_interface}\n  dhcp_timeout: 120\n  dhcpv4_options:\n    mgmt:\n      host-name: ${hostname}\n      domain-name: ${domain}\n    '${default_route_interface}':\n      routers: ${default_route_gateway}\n  do_enabled: true \n  do_declaration: ${do_local_declaration}\n  do_declaration_url: ${do_declaration_url}\n  do_declaration_url_headers:\n    PRIVATE-TOKEN: x6VpQuWhiT_KgT3mzyTe\n  do_template_variables:\n    primary_dns: 8.8.8.8\n    secondary_dns: 1.1.1.1\n    timezone: Europe/Paris\n    primary_ntp: 132.163.96.5\n    secondary_ntp: 132.163.97.5\n    primary_radius: 10.20.22.20\n    primary_radius_secret: testing123\n    secondary_radius: 10.20.23.20\n    secondary_radius_secret: testing123\n  as3_enabled: true\n  as3_declaration_url: ${as3_declaration_url}\n  as3_declaration_url_headers:\n    PRIVATE-TOKEN: x6VpQuWhiT_KgT3mzyTe\n  as3_template_variables:\n    selfip_snat_address: 10.20.40.40\n  ts_enabled: true\n  ts_declaration_url: ${ts_declaration_url}\n  ts_declaration_url_headers:\n    PRIVATE-TOKEN: x6VpQuWhiT_KgT3mzyTe\n  ts_template_variables:\n    splunk_log_ingest: 10.20.23.30\n    splunk_password: 0f29e5dc-bee8-4898-9054-9b66574a3e14\n  phone_home_url: ${phone_home_url}\n  phone_home_url_verify_tls: false\n  phone_home_url_metadata:\n    template_source: ${template_source}\n    template_version: ${template_version}\n    zone: ${zone}\n    vpc: ${vpc}\n    app_id: ${app_id}\n  tgactive_url: ${tgactive_url}\n  tgstandby_url: ${tgstandby_url}\n  tgrefresh_url: ${tgrefresh_url}\n  ",
      vars: {
        app_id: "null",
        as3_declaration_url: "null",
        configsync_interface: "1.1",
        default_route_gateway: "10.6.50.1",
        default_route_interface: "1.3",
        do_declaration_url: "null",
        do_local_declaration: "null",
        domain: "f5-ve-01",
        hostname: "f5-ve-01",
        phone_home_url: "null",
        template_source:
          "f5devcentral/ibmcloud_schematics_bigip_multinic_declared",
        template_version: "20210201",
        tgactive_url: "",
        tgrefresh_url: "null",
        tgstandby_url: "null",
        tmos_admin_password: "null",
        ts_declaration_url: "null",
        zone: "us-south-2",
      },
    })
  );

  tfx.module(
    "F5 Cloud Init At Test F5 Zone 1",
    'module.acceptance_tests.module.landing-zone.module.dynamic_values.module.f5_cloud_init["at-test-f5-zone-1"]',
    tfx.resource("User Data", "data.template_file.user_data", {
      template:
        "#cloud-config\nchpasswd:\n  expire: false\n  list: |\n    admin:${tmos_admin_password}\ntmos_dhcpv4_tmm:\n  enabled: true\n  rd_enabled: false\n  icontrollx_trusted_sources: false\n  inject_routes: true\n  configsync_interface: ${configsync_interface}\n  default_route_interface: ${default_route_interface}\n  dhcp_timeout: 120\n  dhcpv4_options:\n    mgmt:\n      host-name: ${hostname}\n      domain-name: ${domain}\n    '${default_route_interface}':\n      routers: ${default_route_gateway}\n  do_enabled: true \n  do_declaration: ${do_local_declaration}\n  do_declaration_url: ${do_declaration_url}\n  do_declaration_url_headers:\n    PRIVATE-TOKEN: x6VpQuWhiT_KgT3mzyTe\n  do_template_variables:\n    primary_dns: 8.8.8.8\n    secondary_dns: 1.1.1.1\n    timezone: Europe/Paris\n    primary_ntp: 132.163.96.5\n    secondary_ntp: 132.163.97.5\n    primary_radius: 10.20.22.20\n    primary_radius_secret: testing123\n    secondary_radius: 10.20.23.20\n    secondary_radius_secret: testing123\n  as3_enabled: true\n  as3_declaration_url: ${as3_declaration_url}\n  as3_declaration_url_headers:\n    PRIVATE-TOKEN: x6VpQuWhiT_KgT3mzyTe\n  as3_template_variables:\n    selfip_snat_address: 10.20.40.40\n  ts_enabled: true\n  ts_declaration_url: ${ts_declaration_url}\n  ts_declaration_url_headers:\n    PRIVATE-TOKEN: x6VpQuWhiT_KgT3mzyTe\n  ts_template_variables:\n    splunk_log_ingest: 10.20.23.30\n    splunk_password: 0f29e5dc-bee8-4898-9054-9b66574a3e14\n  phone_home_url: ${phone_home_url}\n  phone_home_url_verify_tls: false\n  phone_home_url_metadata:\n    template_source: ${template_source}\n    template_version: ${template_version}\n    zone: ${zone}\n    vpc: ${vpc}\n    app_id: ${app_id}\n  tgactive_url: ${tgactive_url}\n  tgstandby_url: ${tgstandby_url}\n  tgrefresh_url: ${tgrefresh_url}\n  ",
      vars: {
        app_id: "null",
        as3_declaration_url: "null",
        configsync_interface: "1.1",
        default_route_gateway: "10.5.50.1",
        default_route_interface: "1.3",
        do_declaration_url: "null",
        do_local_declaration: "null",
        domain: "f5-ve-01",
        hostname: "f5-ve-01",
        phone_home_url: "null",
        template_source:
          "f5devcentral/ibmcloud_schematics_bigip_multinic_declared",
        template_version: "20210201",
        tgactive_url: "",
        tgrefresh_url: "null",
        tgstandby_url: "null",
        tmos_admin_password: "null",
        ts_declaration_url: "null",
        zone: "us-south-1",
      },
    })
  );

  tfx.module(
    "Vsi At Test Workload Server",
    'module.acceptance_tests.module.landing-zone.module.vsi["at-test-workload-server"]',
    tfx.resource("Vsi", 'ibm_is_instance.vsi["at-test-workload-server-1"]', {
      boot_volume: [
        {
          snapshot: null,
        },
      ],
      force_action: false,
      image: "r006-35668c13-c034-43b2-b0a1-2994b9044cec",
      name: "at-test-workload-server-1",
      primary_network_interface: [
        {
          allow_ip_spoofing: false,
        },
      ],
      profile: "cx2-4x8",
      wait_before_delete: true,
      zone: "us-south-1",
    }),
    tfx.resource("Vsi", 'ibm_is_instance.vsi["at-test-workload-server-2"]', {
      boot_volume: [
        {
          snapshot: null,
        },
      ],
      force_action: false,
      image: "r006-35668c13-c034-43b2-b0a1-2994b9044cec",
      name: "at-test-workload-server-2",
      primary_network_interface: [
        {
          allow_ip_spoofing: false,
        },
      ],
      profile: "cx2-4x8",
      wait_before_delete: true,
      zone: "us-south-2",
    }),
    tfx.resource("Vsi", 'ibm_is_instance.vsi["at-test-workload-server-3"]', {
      boot_volume: [
        {
          snapshot: null,
        },
      ],
      force_action: false,
      image: "r006-35668c13-c034-43b2-b0a1-2994b9044cec",
      name: "at-test-workload-server-3",
      primary_network_interface: [
        {
          allow_ip_spoofing: false,
        },
      ],
      profile: "cx2-4x8",
      wait_before_delete: true,
      zone: "us-south-3",
    }),
    tfx.resource(
      "Security Group",
      'ibm_is_security_group.security_group["workload"]',
      {
        name: "workload",
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["workload-allow-ibm-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["workload-allow-ibm-tcp-443-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["workload-allow-ibm-tcp-53-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 53,
            port_min: 53,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["workload-allow-ibm-tcp-80-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 80,
            port_min: 80,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["workload-allow-vpc-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["workload-allow-vpc-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    )
  );

  tfx.module(
    "Vsi At Test Management Server",
    'module.acceptance_tests.module.landing-zone.module.vsi["at-test-management-server"]',
    tfx.resource("Vsi", 'ibm_is_instance.vsi["at-test-management-server-1"]', {
      boot_volume: [
        {
          snapshot: null,
        },
      ],
      force_action: false,
      image: "r006-35668c13-c034-43b2-b0a1-2994b9044cec",
      name: "at-test-management-server-1",
      primary_network_interface: [
        {
          allow_ip_spoofing: false,
        },
      ],
      profile: "cx2-4x8",
      wait_before_delete: true,
      zone: "us-south-1",
    }),
    tfx.resource("Vsi", 'ibm_is_instance.vsi["at-test-management-server-2"]', {
      boot_volume: [
        {
          snapshot: null,
        },
      ],
      force_action: false,
      image: "r006-35668c13-c034-43b2-b0a1-2994b9044cec",
      name: "at-test-management-server-2",
      primary_network_interface: [
        {
          allow_ip_spoofing: false,
        },
      ],
      profile: "cx2-4x8",
      wait_before_delete: true,
      zone: "us-south-2",
    }),
    tfx.resource("Vsi", 'ibm_is_instance.vsi["at-test-management-server-3"]', {
      boot_volume: [
        {
          snapshot: null,
        },
      ],
      force_action: false,
      image: "r006-35668c13-c034-43b2-b0a1-2994b9044cec",
      name: "at-test-management-server-3",
      primary_network_interface: [
        {
          allow_ip_spoofing: false,
        },
      ],
      profile: "cx2-4x8",
      wait_before_delete: true,
      zone: "us-south-3",
    }),
    tfx.resource(
      "Security Group",
      'ibm_is_security_group.security_group["management"]',
      {
        name: "management",
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["management-allow-ibm-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["management-allow-ibm-tcp-443-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["management-allow-ibm-tcp-53-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 53,
            port_min: 53,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["management-allow-ibm-tcp-80-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 80,
            port_min: 80,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["management-allow-vpc-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["management-allow-vpc-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    )
  );

  tfx.module(
    "F5 Vsi At Test F5 Zone 1",
    'module.acceptance_tests.module.landing-zone.module.f5_vsi["at-test-f5-zone-1"]',
    tfx.resource("Vsi", 'ibm_is_instance.vsi["at-test-f5-zone-1-1"]', {
      boot_volume: [
        {
          snapshot: null,
        },
      ],
      force_action: false,
      image: "r006-96eff507-273e-48af-8790-74c74cf4cebd",
      name: "at-test-f5-zone-1-1",
      network_interfaces: [
        {
          allow_ip_spoofing: true,
        },
        {
          allow_ip_spoofing: true,
        },
        {
          allow_ip_spoofing: true,
        },
      ],
      primary_network_interface: [
        {
          allow_ip_spoofing: false,
        },
      ],
      profile: "cx2-4x8",
      wait_before_delete: true,
      zone: "us-south-1",
    }),
    tfx.resource(
      "Security Group",
      'ibm_is_security_group.security_group["f5-management-sg-1"]',
      {
        name: "f5-management-sg-1",
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-bastion-1-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-bastion-1-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-bastion-2-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-bastion-2-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-bastion-3-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-bastion-3-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-ibm-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-ibm-tcp-443-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-ibm-tcp-53-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 53,
            port_min: 53,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-ibm-tcp-80-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 80,
            port_min: 80,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-vpc-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-1-allow-vpc-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    )
  );

  tfx.module(
    "F5 Vsi At Test F5 Zone 2",
    'module.acceptance_tests.module.landing-zone.module.f5_vsi["at-test-f5-zone-2"]',
    tfx.resource("Vsi", 'ibm_is_instance.vsi["at-test-f5-zone-2-1"]', {
      boot_volume: [
        {
          snapshot: null,
        },
      ],
      force_action: false,
      image: "r006-96eff507-273e-48af-8790-74c74cf4cebd",
      name: "at-test-f5-zone-2-1",
      network_interfaces: [
        {
          allow_ip_spoofing: true,
        },
        {
          allow_ip_spoofing: true,
        },
        {
          allow_ip_spoofing: true,
        },
      ],
      primary_network_interface: [
        {
          allow_ip_spoofing: false,
        },
      ],
      profile: "cx2-4x8",
      wait_before_delete: true,
      zone: "us-south-2",
    }),
    tfx.resource(
      "Security Group",
      'ibm_is_security_group.security_group["f5-management-sg-2"]',
      {
        name: "f5-management-sg-2",
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-bastion-1-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-bastion-1-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-bastion-2-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-bastion-2-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-bastion-3-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-bastion-3-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-ibm-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-ibm-tcp-443-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-ibm-tcp-53-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 53,
            port_min: 53,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-ibm-tcp-80-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 80,
            port_min: 80,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-vpc-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-2-allow-vpc-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    )
  );

  tfx.module(
    "F5 Vsi At Test F5 Zone 3",
    'module.acceptance_tests.module.landing-zone.module.f5_vsi["at-test-f5-zone-3"]',
    tfx.resource("Vsi", 'ibm_is_instance.vsi["at-test-f5-zone-3-1"]', {
      boot_volume: [
        {
          snapshot: null,
        },
      ],
      force_action: false,
      image: "r006-96eff507-273e-48af-8790-74c74cf4cebd",
      name: "at-test-f5-zone-3-1",
      network_interfaces: [
        {
          allow_ip_spoofing: true,
        },
        {
          allow_ip_spoofing: true,
        },
        {
          allow_ip_spoofing: true,
        },
      ],
      primary_network_interface: [
        {
          allow_ip_spoofing: false,
        },
      ],
      profile: "cx2-4x8",
      wait_before_delete: true,
      zone: "us-south-3",
    }),
    tfx.resource(
      "Security Group",
      'ibm_is_security_group.security_group["f5-management-sg-3"]',
      {
        name: "f5-management-sg-3",
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-bastion-1-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-bastion-1-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.5.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-bastion-2-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-bastion-2-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.6.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-bastion-3-inbound-22"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 22,
            port_min: 22,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-bastion-3-inbound-443"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.7.70.0/24",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-ibm-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-ibm-tcp-443-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 443,
            port_min: 443,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-ibm-tcp-53-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 53,
            port_min: 53,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-ibm-tcp-80-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "161.26.0.0/16",
        tcp: [
          {
            port_max: 80,
            port_min: 80,
          },
        ],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-vpc-inbound"]',
      {
        direction: "inbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    ),
    tfx.resource(
      "Security Group Rules",
      'ibm_is_security_group_rule.security_group_rules["f5-management-sg-3-allow-vpc-outbound"]',
      {
        direction: "outbound",
        icmp: [],
        ip_version: "ipv4",
        remote: "10.0.0.0/8",
        tcp: [],
        udp: [],
      }
    )
  );
});
