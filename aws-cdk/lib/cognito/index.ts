import { UserPool, AccountRecovery } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import { AssetCode, Runtime, LayerVersion } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";

interface CognitoProps {
    clientName: string;
}

export class Cognito extends Construct {
    constructor(scope: Construct, id: string, props: CognitoProps) {
        super(scope, id);

        const sdkLayer = new LayerVersion(this, "aws-sdk-layer", {
            compatibleRuntimes: [Runtime.NODEJS_14_X, Runtime.NODEJS_16_X],
            code: new AssetCode("src/layers/aws-sdk-utils"),
            description: "aws-sdk utils for lambda functions",
        });

        const defineAuthChallenge = new NodejsFunction(this, "DefineAuthChallenge", {
            runtime: Runtime.NODEJS_16_X,
            entry: join(__dirname, `/../src/lambda/define-auth-challenge.ts`),
        });

        const createAuthChallenge = new NodejsFunction(this, "CreateAuthChallenge", {
            runtime: Runtime.NODEJS_16_X,
            entry: join(__dirname, `/../src/lambda/create-auth-challenge.ts`),
            bundling: {
                minify: false,
                
                externalModules: [
                    "@aws-sdk/client-sesv2",
                ],
            },
        });

        const verifyAuthChallengeResponse = new NodejsFunction(this, "VerifyAuthChallengeResponse", {
            runtime: Runtime.NODEJS_16_X,
            entry: join(__dirname, `/../src/lambda/verify-auth-challenge-response.ts`),
        });

        const userpool = new UserPool(this, `${props.clientName}UserPool`, {
            userPoolName: `${props.clientName}UserPool`,
            selfSignUpEnabled: false,
            signInAliases: { email: true },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
            },
            passwordPolicy: {
                requireLowercase: false,
                requireDigits: false,
                requireUppercase: false,
                requireSymbols: false,
            },
            accountRecovery: AccountRecovery.NONE,
            removalPolicy: RemovalPolicy.DESTROY,
            lambdaTriggers: {
                defineAuthChallenge: defineAuthChallenge,
                createAuthChallenge: createAuthChallenge,
                verifyAuthChallengeResponse: verifyAuthChallengeResponse,
            },
        });

        const client = userpool.addClient(`UserPoolClient${props.clientName}`, {
            userPoolClientName: props.clientName,
            authFlows: {
                custom: true,
            },
        });
    }
}
