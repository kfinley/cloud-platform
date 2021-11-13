import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';

export type LoadBalancedFargateProps = {
  serviceName: string,
  cluster: ecs.ICluster,
  cpu: number,
  memoryLimitMiB: number
};

export abstract class LoadBalancedFargate extends cdk.Construct {
  readonly props: LoadBalancedFargateProps;
  readonly albFargate: ecsPatterns.ApplicationLoadBalancedFargateService;

  constructor(scope: cdk.Construct, id: string, props: LoadBalancedFargateProps) {
    super(scope, id);

    this.props = props;
    this.albFargate = this.create();
  }

  private create(): ecsPatterns.ApplicationLoadBalancedFargateService {
    return new ecsPatterns.ApplicationLoadBalancedFargateService(this, `${this.props.serviceName}-FargateService`, {
      serviceName: this.props.serviceName,
      cluster: this.props.cluster,
      taskDefinition: this.createFargateTaskDefinition(),
      openListener: false,
    });
  }

  protected abstract createFargateTaskDefinition(): ecs.FargateTaskDefinition;
}