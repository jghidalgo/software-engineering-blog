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
            Accelerating Local Serverless Development with Console-to-IDE and Remote Debugging for AWS Lambda
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>September 12, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>6 min read</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {['AWS', 'Lambda', 'Serverless', 'Debugging', 'IDE', 'Development'].map((tag) => (
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
            One of the biggest challenges in serverless development has always been debugging. With AWS Lambda, developers typically rely on CloudWatch logs or repeated redeployments to validate changes—slowing down iteration and making troubleshooting frustrating.
          </p>

          <p>
            AWS has introduced a game-changer: <strong>Console-to-IDE integration with Remote Debugging for AWS Lambda</strong>. This capability connects your Lambda functions directly with your IDE, enabling you to debug in real-time, with breakpoints, variable inspection, and local test events.
          </p>

          <h2 style={{ color: '#8c5b08' }}>Key Features</h2>

          <h3 style={{ color: '#8c5b08' }}>Console-to-IDE Linking</h3>
          <p>
            From the Lambda console, you can now open a function directly in your local IDE (Visual Studio Code or JetBrains IDEs).
          </p>
          <p>
            The IDE connects through the AWS Toolkit plugin, automatically configuring your project for Lambda development.
          </p>

          <h3 style={{ color: '#8c5b08' }}>Remote Debugging</h3>
          <p>
            You can attach a remote debugger to a running Lambda.
          </p>
          <p>
            This means you can step through code execution in the actual AWS environment, while inspecting runtime values and resource behavior.
          </p>

          <h3 style={{ color: '#8c5b08' }}>Local Development with Cloud Context</h3>
          <p>
            By syncing your Lambda&apos;s configuration (environment variables, IAM role permissions, runtime settings) with your local environment, you can replicate production conditions more accurately.
          </p>

          <h2 style={{ color: '#8c5b08' }}>Getting Started</h2>

          <h3 style={{ color: '#8c5b08' }}>Prerequisites</h3>
          <ul>
            <li>AWS Toolkit installed in your IDE (VS Code or JetBrains).</li>
            <li>AWS CLI configured with credentials.</li>
            <li>Permissions to use the Lambda console and attach debuggers.</li>
          </ul>

          <h3 style={{ color: '#8c5b08' }}>Step 1: Open Function from Console</h3>
          <ol>
            <li>Navigate to your Lambda function in the AWS Console.</li>
            <li>Click <strong>&quot;Open in IDE&quot;</strong>.</li>
            <li>Your IDE will prompt to open the project, installing dependencies and creating a launch configuration.</li>
          </ol>

          <h3 style={{ color: '#8c5b08' }}>Step 2: Enable Remote Debugging</h3>
          <p>For <strong>Node.js</strong>, add the inspector flag in your <code>template.yaml</code> or function settings:</p>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">template.yaml</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                <span className="text-purple-400">Resources</span>:<br/>
                {"  "}<span className="text-blue-400">MyFunction</span>:<br/>
                {"    "}<span className="text-purple-400">Type</span>: <span className="text-green-400">AWS::Serverless::Function</span><br/>
                {"    "}<span className="text-purple-400">Properties</span>:<br/>
                {"      "}<span className="text-purple-400">Handler</span>: <span className="text-green-400">app.handler</span><br/>
                {"      "}<span className="text-purple-400">Runtime</span>: <span className="text-green-400">nodejs18.x</span><br/>
                {"      "}<span className="text-purple-400">Environment</span>:<br/>
                {"        "}<span className="text-purple-400">Variables</span>:<br/>
                {"          "}<span className="text-purple-400">NODE_OPTIONS</span>: <span className="text-green-400">&quot;--inspect=0.0.0.0:9229&quot;</span>
              </code>
            </pre>
          </div>

          <p>For <strong>Python</strong>, use:</p>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">template.yaml</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                <span className="text-purple-400">Environment</span>:<br/>
                {"  "}<span className="text-purple-400">Variables</span>:<br/>
                {"    "}<span className="text-purple-400">PYTHONBREAKPOINT</span>: <span className="text-green-400">pdb.set_trace</span>
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#8c5b08' }}>Step 3: Set Breakpoints and Debug</h3>
          <ol>
            <li>In your IDE, choose <strong>Run → Start Debugging</strong>.</li>
            <li>Set breakpoints in your code.</li>
            <li>Trigger the Lambda (via test event or API Gateway).</li>
            <li>Watch the debugger hit breakpoints, showing live values.</li>
          </ol>

          <h2 style={{ color: '#8c5b08' }}>Developer Benefits</h2>
          <ul>
            <li><strong>Faster iteration</strong>: No need to redeploy for every change—you can test and debug interactively.</li>
            <li><strong>Production-accurate debugging</strong>: Functions run with the same permissions, environment variables, and triggers as in AWS.</li>
            <li><strong>Seamless collaboration</strong>: Teams standardize their workflow by using IDE configurations tied to the Lambda console.</li>
          </ul>

          <h2 style={{ color: '#8c5b08' }}>Final Thoughts</h2>
          <p>
            This update significantly improves the developer experience for serverless builders. Whether you&apos;re building microservices, event-driven apps, or data pipelines, remote debugging will save hours of log-checking and redeploying.
          </p>

          <p>
            👉 <strong>Dive into the full AWS announcement here</strong>: <a 
              href="https://aws.amazon.com/blogs/compute/accelerating-local-serverless-development-with-console-to-ide-and-remote-debugging-for-aws-lambda/" 
              className="text-primary-600 dark:text-primary-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Accelerating local serverless development with console-to-IDE and remote debugging for AWS Lambda
            </a>
          </p>

          <div className="mt-12 p-6 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
            <p className="text-secondary-700 dark:text-secondary-200 italic mb-0">
              Have you tried the new Console-to-IDE integration? Share your experience and any tips you&apos;ve discovered in the comments below!
            </p>
          </div>
        </div>
        </div>
      </article>
    </div>
  );
}