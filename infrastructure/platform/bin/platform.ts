#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { MainStack } from '../lib/main-stack';
import { UserStack } from '@cloud-platform/infrastructure-user-service/lib/user-stack';
import { WebSocketsStack } from '@cloud-platform/infrastructure-websockets-service/lib/websockets-stack';

const VPC_CIDR = '10.10.0.0/16';

const app = new cdk.App();

const main = new MainStack(app, 'MainStack', {
  cidr: VPC_CIDR
});

new UserStack(app, 'UserStack', {
  vpc: main.vpc,
  nginxImage: main.nginxImage,
  instanceClass: ec2.InstanceClass.T2,
  instanceSize: ec2.InstanceSize.SMALL,
  loadBalancer: main.loadBalancer,
  httpListener: main.httpListener
});

new WebSocketsStack(app, 'WebSocketsStack', {

});
