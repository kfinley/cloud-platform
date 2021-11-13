import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';

export type MySqlConstructProps = {
    vpc: ec2.Vpc,
    instanceClass: ec2.InstanceClass,
    instanceSize: ec2.InstanceSize,
    asgSecurityGroups: ec2.ISecurityGroup[]
};

export class MySqlConstruct extends cdk.Construct {

    constructor(scope: cdk.Stack, id: string, props: MySqlConstructProps) {
        super(scope, id);

        var db = new rds.DatabaseInstance(scope, 'RDS-MySql', {
            vpc: props.vpc,
            engine: rds.DatabaseInstanceEngine.mysql({
                version: rds.MysqlEngineVersion.VER_5_7_34
            }),
            instanceType: ec2.InstanceType.of(
                props.instanceClass,
                props.instanceSize
            ),
            vpcSubnets: props.vpc.selectSubnets({
                subnetGroupName: "Private-Data"
            }),
            multiAz: true,
            allocatedStorage: 100,
            storageType: rds.StorageType.GP2,
            cloudwatchLogsExports: [
                'audit',
                'error',
                'general',
                'slowquery'
            ],
            deletionProtection: false,
            deleteAutomatedBackups: false,
            backupRetention: cdk.Duration.days(7),
        });

        props.asgSecurityGroups.forEach(sg => {
            db.connections.allowDefaultPortFrom(sg, "EC2 Autoscaling Group access MySql");
        })





















        // const mysqlSecurityGroup = new ec2.SecurityGroup(
        //     this,
        //     'system-sg-mysql',
        //     {
        //         vpc: props.vpc,
        //         securityGroupName: 'RDSSecurityGroupMYSQL',
        //         description: 'Allow MySQL access to RDS instance from VPC',
        //         allowAllOutbound: true   // Can be set to false
        //     }
        // );
        // mysqlSecurityGroup.addIngressRule(ec2.Peer.ipv4("10.101.0.0/16"), ec2.Port.tcp(3306), 'Allow MySQL access from the VPC');

        // const mysqlExternalSecurityGroup = new ec2.SecurityGroup(
        //     this,
        //     'system-sg-mysql-ext',
        //     {
        //         vpc: props.vpc,
        //         securityGroupName: 'RDSSecurityGroupMYSQLEXT',
        //         description: 'Allow MySQL access to RDS instance externally',
        //         allowAllOutbound: true   // Can be set to false
        //     }
        // );

        // const mySQLRDSInstance = new rds.DatabaseInstance(
        //     this,
        //     'mysql-rds-instance',
        //     {
        //         engine: rds.DatabaseInstanceEngine.MARIADB,
        //         instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        //         vpc: props.vpc,
        //         vpcPlacement: { subnetType: ec2.SubnetType.PUBLIC },
        //         securityGroups: [mysqlSecurityGroup, mysqlExternalSecurityGroup],
        //         storageEncrypted: false,
        //         multiAz: false,
        //         autoMinorVersionUpgrade: false,
        //         allocatedStorage: 20,
        //         storageType: rds.StorageType.GP2,
        //         deletionProtection: false,
        //         databaseName: 'db_change_log',
        //         port: 3306
        //     }
        // );






















        // const dbInstance = new rds.DatabaseInstance(this, 'db-instance', {
        //     vpc: props.vpc,
        //     vpcSubnets: {
        //         subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        //     },
        //     engine: rds.DatabaseInstanceEngine.postgres({
        //         version: rds.PostgresEngineVersion.VER_13_1,
        //     }),
        //     instanceType: ec2.InstanceType.of(
        //         ec2.InstanceClass.BURSTABLE3,
        //         ec2.InstanceSize.MICRO,
        //     ),
        //     credentials: rds.Credentials.fromGeneratedSecret('postgres'),
        //     multiAz: false,
        //     allocatedStorage: 100,
        //     maxAllocatedStorage: 105,
        //     allowMajorVersionUpgrade: false,
        //     autoMinorVersionUpgrade: true,
        //     backupRetention: cdk.Duration.days(0),
        //     deleteAutomatedBackups: true,
        //     removalPolicy: cdk.RemovalPolicy.DESTROY,
        //     deletionProtection: false,
        //     databaseName: 'todosdb',
        //     publiclyAccessible: false,
        // });

        // dbInstance.connections.allowFrom(props.ec2Instance, ec2.Port.tcp(5432));

        // new cdk.CfnOutput(this, 'dbEndpoint', {
        //     value: dbInstance.instanceEndpoint.hostname,
        // });

        // new cdk.CfnOutput(this, 'secretName', {
        //     // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        //     value: dbInstance.secret?.secretName!,
        // });



        //         var mySqlPassword = new Secret(this, "PersonalSecOpsMySqlPassword", new SecretProps
        // {
        //                 GenerateSecretString = new SecretStringGenerator
        //     {
        //                 PasswordLength = 20
        //             }
        // });

        // var mySql = new rds.DatabaseInstance(this, "PersonalSecOpsRds", new rds.DatabaseInstanceProps
        // {
        //                     Engine = RDS.DatabaseInstanceEngine.MYSQL,
        //                     PreferredBackupWindow = "05:00-06:00",
        //                     BackupRetention = Duration.Days(7),
        //                     RemovalPolicy = RemovalPolicy.DESTROY,
        //                     DeletionProtection = false,
        //                     MasterUsername = "admin",
        //                     MasterUserPassword = mySqlPassword.SecretValue,
        //                     InstanceClass = EC2.InstanceType.Of(EC2.InstanceClass.BURSTABLE2, EC2.InstanceSize.MICRO),
        //                     Vpc = vpc,
        //                     InstanceIdentifier = "PersonalSecOpsRds"
        //                 });


    }



}