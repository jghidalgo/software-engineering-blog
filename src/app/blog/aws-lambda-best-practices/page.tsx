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
            AWS Lambda Best Practices: Building Serverless Applications
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>September 14, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>8 min read</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {['AWS', 'Lambda', 'Serverless', 'Best Practices', 'Performance'].map((tag) => (
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
            AWS Lambda has revolutionized how we build and deploy applications, enabling truly serverless architectures. However, to get the most out of Lambda, you need to follow proven best practices that ensure optimal performance, cost efficiency, and maintainability.
          </p>

          <p>
            After working with Lambda for several years and helping teams optimize their serverless applications, I&apos;ve compiled the most impactful best practices that can make or break your Lambda functions.
          </p>

          <h2 style={{ color: '#8c5b08' }}>1. Optimize Cold Start Performance</h2>

          <h3 style={{ color: '#8c5b08' }}>Keep Your Dependencies Lean</h3>
          <p>
            The size of your deployment package directly impacts cold start times. Minimize dependencies and only include what you actually need.
          </p>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">package.json</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`// ❌ Bad - importing entire AWS SDK
const AWS = require('aws-sdk');

// ✅ Good - importing only what you need
const { DynamoDB } = require('@aws-sdk/client-dynamodb');`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#8c5b08' }}>Initialize Connections Outside the Handler</h3>
          <p>
            Take advantage of Lambda&apos;s execution context reuse by initializing database connections, AWS clients, and other expensive operations outside your handler function.
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">handler.js</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`// Initialize outside handler - reused across invocations
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const dynamoClient = new DynamoDBClient({});

exports.handler = async (event) => {
  // Handler logic here
  return response;
};`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>2. Right-Size Your Function</h2>

          <h3 style={{ color: '#8c5b08' }}>Memory Configuration</h3>
          <p>
            Memory allocation affects both CPU performance and cost. Use AWS Lambda Power Tuning to find the optimal memory setting for your workload.
          </p>

          <ul>
            <li><strong>CPU-intensive tasks</strong>: Higher memory allocations provide more CPU power</li>
            <li><strong>I/O-intensive tasks</strong>: Lower memory might be sufficient</li>
            <li><strong>Sweet spot</strong>: Often between 512MB - 1024MB for most applications</li>
          </ul>

          <h3 style={{ color: '#8c5b08' }}>Timeout Configuration</h3>
          <p>
            Set appropriate timeouts based on your function&apos;s expected execution time. Don&apos;t default to 15 minutes if your function should complete in seconds.
          </p>

          <h2 style={{ color: '#8c5b08' }}>3. Implement Proper Error Handling</h2>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">error-handling.js</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`exports.handler = async (event) => {
  try {
    // Your business logic
    const result = await processData(event);
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error processing request:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error'
      }) 
    };
  }
};`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>4. Monitoring and Observability</h2>

          <h3 style={{ color: '#8c5b08' }}>Essential Metrics to Track</h3>
          <ul>
            <li><strong>Duration</strong>: Track execution time trends</li>
            <li><strong>Error Rate</strong>: Monitor function failures</li>
            <li><strong>Cold Start Rate</strong>: Percentage of invocations that are cold starts</li>
            <li><strong>Throttle Rate</strong>: Track concurrency limit hits</li>
            <li><strong>Dead Letter Queue Messages</strong>: Failed async invocations</li>
          </ul>

          <h3 style={{ color: '#8c5b08' }}>Structured Logging</h3>
          <p>
            Use structured logging with JSON format for better searchability and analysis in CloudWatch Logs.
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">logging.js</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`// ✅ Good - structured logging
console.log(JSON.stringify({
  level: 'INFO',
  message: 'Processing user request',
  userId: event.userId,
  requestId: context.awsRequestId,
  timestamp: new Date().toISOString()
}));`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>5. Security Best Practices</h2>

          <h3 style={{ color: '#8c5b08' }}>Principle of Least Privilege</h3>
          <p>
            Grant your Lambda functions only the minimum permissions required to perform their tasks.
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">iam-policy.json</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:region:account:table/MyTable"
    }
  ]
}`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#8c5b08' }}>Environment Variables for Secrets</h3>
          <p>
            Use AWS Systems Manager Parameter Store or AWS Secrets Manager for sensitive configuration, not environment variables.
          </p>

          <h2 style={{ color: '#8c5b08' }}>6. Cost Optimization</h2>

          <h3 style={{ color: '#8c5b08' }}>Provisioned Concurrency</h3>
          <p>
            For latency-sensitive applications, consider Provisioned Concurrency to eliminate cold starts, but monitor costs carefully.
          </p>

          <h3 style={{ color: '#8c5b08' }}>ARM-based Graviton2 Processors</h3>
          <p>
            Use ARM-based Lambda functions for up to 34% better price performance compared to x86-based functions.
          </p>

          <h2 style={{ color: '#8c5b08' }}>Final Thoughts</h2>
          <p>
            Following these best practices will help you build Lambda functions that are performant, cost-effective, and maintainable. Remember that serverless doesn&apos;t mean &quot;no ops&quot; - it means different ops, and these practices will help you succeed in your serverless journey.
          </p>

          <p>
            Start with the basics like dependency optimization and proper error handling, then gradually implement more advanced patterns like structured logging and cost optimization strategies.
          </p>

          <div className="mt-12 p-6 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
            <p className="text-secondary-700 dark:text-secondary-200 italic mb-0">
              What Lambda best practices have made the biggest impact in your serverless applications? Share your experiences in the comments!
            </p>
          </div>
        </div>
        </div>
      </article>
    </div>
  );
}