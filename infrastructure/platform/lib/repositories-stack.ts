import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';

export type RepositoriesStackProps = {
  services: string[],
} & cdk.StackProps;

export class RepositoriesStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: RepositoriesStackProps) {
    super(scope, id, props);

    props?.services.forEach(service => {
      new ecr.Repository(scope, `${service}-repo`, {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        repositoryName: id.toLocaleLowerCase(),
        lifecycleRules: [{
          maxImageCount: 3
        }]
      })
    });
  }
}
