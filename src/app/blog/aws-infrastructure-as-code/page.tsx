import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';

export default function BlogPost() {
  return (
    <div className="bg-secondary-50 dark:bg-secondary-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 dark:bg-gradient-to-r dark:from-primary-900 dark:to-secondary-900">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white transition-colors duration-200 mb-8"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Blog
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6">
            Infrastructure as Code with AWS CDK: A Complete Guide
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>September 14, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>10 min read</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {['AWS', 'CDK', 'Infrastructure', 'TypeScript', 'DevOps'].map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/10 text-white border-white/20">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:bg-gradient-to-br dark:from-primary-900/20 dark:to-primary-800/10 rounded-xl p-8 shadow-sm border border-primary-200 dark:border-primary-700/50">
          <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-secondary-700 dark:text-secondary-200 mb-8">
            AWS CDK (Cloud Development Kit) has transformed how we manage infrastructure by bringing the power of programming languages to infrastructure as code. Instead of writing YAML or JSON templates, you can now define your AWS resources using familiar languages like TypeScript, Python, or Java.
          </p>

          <p>
            In this comprehensive guide, we&apos;ll explore how to leverage AWS CDK to build scalable, maintainable infrastructure with TypeScript, covering everything from basic concepts to advanced patterns used in production.
          </p>

          <h2 style={{ color: '#8c5b08' }}>Why Choose AWS CDK?</h2>

          <h3 style={{ color: '#8c5b08' }}>Beyond CloudFormation Templates</h3>
          <p>
            While CloudFormation templates are powerful, they can become unwieldy as your infrastructure grows. CDK addresses these challenges:
          </p>

          <ul>
            <li><strong>Type Safety</strong>: Catch errors at compile time, not deployment time</li>
            <li><strong>Code Reuse</strong>: Create reusable constructs and share them across projects</li>
            <li><strong>IDE Support</strong>: IntelliSense, refactoring, and debugging capabilities</li>
            <li><strong>Familiar Syntax</strong>: Use loops, conditions, and functions naturally</li>
            <li><strong>Testing</strong>: Unit test your infrastructure code</li>
          </ul>

          <h2 style={{ color: '#8c5b08' }}>Getting Started with CDK</h2>

          <h3 style={{ color: '#8c5b08' }}>Installation and Setup</h3>
          <p>
            First, install the AWS CDK CLI and initialize a new TypeScript project:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">Terminal</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`# Install CDK CLI globally
npm install -g aws-cdk

# Create a new CDK project
mkdir my-cdk-project && cd my-cdk-project
cdk init app --language typescript

# Install dependencies
npm install`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#8c5b08' }}>Project Structure</h3>
          <p>
            A typical CDK project structure looks like this:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">Project Structure</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`my-cdk-project/
├── bin/
│   └── my-cdk-project.ts    # Entry point
├── lib/
│   └── my-cdk-project-stack.ts  # Stack definition
├── test/
│   └── my-cdk-project.test.ts   # Unit tests
├── cdk.json                 # CDK configuration
└── package.json            # Dependencies`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Building Your First Stack</h2>

          <h3 style={{ color: '#8c5b08' }}>Creating a Simple Web Application Stack</h3>
          <p>
            Let&apos;s build a stack that includes an S3 bucket for static hosting, CloudFront distribution, and a Lambda function:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">lib/web-app-stack.ts</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class WebAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for static website hosting
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test
    });

    // Lambda function for API
    const apiFunction = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: websiteBucket.bucketName,
      },
    });

    // API Gateway
    const api = new apigateway.LambdaRestApi(this, 'Api', {
      handler: apiFunction,
      proxy: false,
    });

    // Add API resources
    const items = api.root.addResource('items');
    items.addMethod('GET');
    items.addMethod('POST');

    // CloudFront distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution URL',
    });
  }
}`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Advanced CDK Patterns</h2>

          <h3 style={{ color: '#8c5b08' }}>Creating Reusable Constructs</h3>
          <p>
            One of CDK&apos;s most powerful features is the ability to create reusable constructs. Here&apos;s an example of a database construct:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">lib/database-construct.ts</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface DatabaseConstructProps {
  vpc: ec2.Vpc;
  instanceClass?: ec2.InstanceClass;
  instanceSize?: ec2.InstanceSize;
  databaseName: string;
}

export class DatabaseConstruct extends Construct {
  public readonly database: rds.DatabaseInstance;
  public readonly secret: rds.DatabaseSecret;

  constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
    super(scope, id);

    // Create database secret
    this.secret = new rds.DatabaseSecret(this, 'DatabaseSecret', {
      username: 'admin',
      description: 'Database credentials',
    });

    // Create database subnet group
    const subnetGroup = new rds.SubnetGroup(this, 'DatabaseSubnetGroup', {
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      description: 'Subnet group for database',
    });

    // Create database instance
    this.database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_3,
      }),
      instanceType: ec2.InstanceType.of(
        props.instanceClass ?? ec2.InstanceClass.T3,
        props.instanceSize ?? ec2.InstanceSize.MICRO
      ),
      vpc: props.vpc,
      subnetGroup,
      credentials: rds.Credentials.fromSecret(this.secret),
      databaseName: props.databaseName,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false, // Set to true for production
    });
  }
}`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#8c5b08' }}>Environment-Specific Configuration</h3>
          <p>
            Use CDK context and environment variables to manage different deployment environments:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">cdk.json</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`{
  "app": "npx ts-node --prefer-ts-exts bin/my-app.ts",
  "context": {
    "environments": {
      "dev": {
        "instanceClass": "t3.micro",
        "certificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/dev-cert",
        "domainName": "dev.myapp.com"
      },
      "prod": {
        "instanceClass": "t3.medium",
        "certificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/prod-cert",
        "domainName": "myapp.com"
      }
    }
  }
}`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Testing Your Infrastructure</h2>

          <h3 style={{ color: '#8c5b08' }}>Unit Testing with Jest</h3>
          <p>
            CDK allows you to unit test your infrastructure code. Here&apos;s an example test:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">test/web-app-stack.test.ts</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { WebAppStack } from '../lib/web-app-stack';

test('Web App Stack creates S3 bucket', () => {
  const app = new cdk.App();
  const stack = new WebAppStack(app, 'TestStack');
  const template = Template.fromStack(stack);

  // Assert S3 bucket is created
  template.hasResourceProperties('AWS::S3::Bucket', {
    WebsiteConfiguration: {
      IndexDocument: 'index.html',
      ErrorDocument: 'error.html',
    },
  });
});

test('Web App Stack creates Lambda function', () => {
  const app = new cdk.App();
  const stack = new WebAppStack(app, 'TestStack');
  const template = Template.fromStack(stack);

  // Assert Lambda function is created
  template.hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs18.x',
    Handler: 'index.handler',
  });
});`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Deployment and Best Practices</h2>

          <h3 style={{ color: '#8c5b08' }}>Deployment Pipeline</h3>
          <p>
            Set up a proper CI/CD pipeline for your infrastructure:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">Deploy Commands</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`# Synthesize CloudFormation templates
cdk synth

# Compare deployed stack with current state
cdk diff

# Deploy to development environment
cdk deploy --context environment=dev

# Deploy to production environment
cdk deploy --context environment=prod --require-approval never`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#8c5b08' }}>Key Best Practices</h3>
          <ul>
            <li><strong>Use meaningful construct names</strong>: Make them descriptive and consistent</li>
            <li><strong>Implement proper tagging</strong>: Tag resources for cost tracking and management</li>
            <li><strong>Leverage aspects</strong>: Apply cross-cutting concerns like security policies</li>
            <li><strong>Version your constructs</strong>: Use semantic versioning for reusable constructs</li>
            <li><strong>Use feature flags</strong>: Control feature rollouts through context variables</li>
            <li><strong>Implement proper error handling</strong>: Handle deployment failures gracefully</li>
          </ul>

          <h2 style={{ color: '#8c5b08' }}>Conclusion</h2>
          <p>
            AWS CDK represents a significant step forward in infrastructure as code, bringing software engineering best practices to infrastructure management. By leveraging TypeScript&apos;s type safety, IDE support, and familiar programming constructs, teams can build more maintainable and scalable infrastructure.
          </p>

          <p>
            Start small with a simple stack, gradually adopt advanced patterns like custom constructs and testing, and always follow security best practices. The investment in learning CDK will pay dividends in improved development velocity and infrastructure reliability.
          </p>

          <div className="mt-12 p-6 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
            <p className="text-secondary-700 dark:text-secondary-200 italic mb-0">
              Have you migrated from CloudFormation to CDK? What challenges did you face and how did CDK help solve them? Share your experience!
            </p>
          </div>
        </div>
        </div>
      </article>
    </div>
  );
}