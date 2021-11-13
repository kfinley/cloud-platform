import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecr_deployment from "cdk-ecr-deployment";
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';

export type MainStackProps = {
  cidr: string,
} & cdk.StackProps;

export class MainStack extends cdk.Stack {

  readonly vpc: ec2.Vpc;
  readonly nginxImage: DockerImageAsset;
  readonly loadBalancer: elbv2.ApplicationLoadBalancer;
  readonly httpListener: elbv2.ApplicationListener;

  constructor(scope: cdk.Construct, id: string, props: MainStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, "MainVpc", {
      cidr: props.cidr,
      subnetConfiguration: [
        { cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC, name: "Public" },
        { cidrMask: 24, subnetType: ec2.SubnetType.PRIVATE_ISOLATED, name: "Private-Services" },
        { cidrMask: 24, subnetType: ec2.SubnetType.PRIVATE_ISOLATED, name: "Private-Data" }
      ],
      maxAzs: 2,
      natGateways: 2
    });

    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, `Main-Alb`, {
      vpc: this.vpc,
      internetFacing: true,
      securityGroup: new ec2.SecurityGroup(this, `Main-AlbSecurityGroup`, {
        vpc: this.vpc,
        securityGroupName: `main-alb-security-group`,
        description: `Main ALB Security Group`,
        allowAllOutbound: true
      })
    });

    this.loadBalancer.connections.allowFromAnyIpv4(
      ec2.Port.tcp(80), "Internet access ALB 80");

    this.httpListener = this.loadBalancer.addListener("http-listener", {
      port:80,
      open: true
    });

    new cdk.CfnOutput(this, 'VPC ID', {
      value: this.vpc.vpcId,
    });

    // // Redirect to HTTPS
    // this.loadBalancer.addListener('http-listener', {
    //   port: 80,
    //   protocol: elbv2.ApplicationProtocol.HTTP,
    //   defaultTargetGroups: []
    // }).addRedirectResponse('ssl-redirect', {
    //   statusCode: 'HTTP_302',
    //   protocol: elbv2.ApplicationProtocol.HTTPS,
    //   port: '443'
    // })

    this.nginxImage = new DockerImageAsset(this, 'nginx', {
      directory: path.join(__dirname, '../../docker/nginx/')
    });

    const nginxRepo = new ecr.Repository(this, `nginx-repo`, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      imageScanOnPush: true,
      lifecycleRules: [{
        maxImageCount: 3
      }]
    });

    const ecrDeployment = new ecr_deployment.ECRDeployment(this, "DeployImageLatestTag", {
      src: new ecr_deployment.DockerImageName(this.nginxImage.imageUri),
      dest: new ecr_deployment.DockerImageName(`${nginxRepo.repositoryUri}:latest`),
      vpc: this.vpc,
    });

    // console.log(ecrDeployment.node._actualNode.children[0]);
    // const cfnEcrDeployment = ecrDeployment.node.defaultChild as cdk.CfnResource;
    // console.log(cfnEcrDeployment);

    //cfnEcrDeployment.addPropertyDeletionOverride('NetworkMode');
  }
}
