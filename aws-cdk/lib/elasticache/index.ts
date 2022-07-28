import { Construct } from "constructs";
import { Vpc, InterfaceVpcEndpointAwsService, SecurityGroup } from "aws-cdk-lib/aws-ec2";

interface ElasticacheProps {
    name: string;
}

export class Elasticache extends Construct {
    constructor(scope: Construct, id: string, props: ElasticacheProps) {
        super(scope, id);

        // Add gateway endpoints when creating the VPC
        const vpc = new Vpc(this, "MyVpc", {
            maxAzs: 1,
        });

        const lambdaSecGroup = new SecurityGroup(this, "LambdaSecurityGroup", {
            vpc: vpc,
        });
    }
}
