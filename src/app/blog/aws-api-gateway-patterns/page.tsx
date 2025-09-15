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
            AWS API Gateway Patterns and Best Practices
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>September 14, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>11 min read</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {['AWS', 'API Gateway', 'REST', 'Serverless', 'Architecture'].map((tag) => (
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
            AWS API Gateway is the front door to your serverless applications, handling millions of API calls while providing authentication, rate limiting, monitoring, and more. However, to build robust, scalable APIs, you need to understand the key patterns and best practices that separate production-ready APIs from basic implementations.
          </p>

          <p>
            In this comprehensive guide, we&apos;ll explore proven API Gateway patterns, authentication strategies, performance optimizations, and monitoring approaches that will help you build APIs that scale.
          </p>

          <h2 style={{ color: '#8c5b08' }}>API Gateway Types and When to Use Each</h2>

          <h3 style={{ color: '#8c5b08' }}>REST API vs HTTP API vs WebSocket API</h3>
          <p>
            Understanding which API Gateway type to use is crucial for your architecture:
          </p>

          <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-6 mb-6">
            <h4 className="font-bold mb-4 text-secondary-900 dark:text-white">When to Use Each Type:</h4>
            <ul className="space-y-2">
              <li><strong>REST API</strong>: Full feature set, request/response transformations, detailed monitoring</li>
              <li><strong>HTTP API</strong>: Lower cost, better performance, JWT authorizers, OIDC/OAuth2</li>
              <li><strong>WebSocket API</strong>: Real-time bidirectional communication, chat applications, live updates</li>
            </ul>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Authentication and Authorization Patterns</h2>

          <h3 style={{ color: '#8c5b08' }}>JWT Authorizer with Cognito</h3>
          <p>
            The most common pattern for modern web applications combines Cognito User Pools with JWT authorizers:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">jwt-authorizer.yaml</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`Resources:
  HttpApi:
    Type: AWS::ApiGatewayV2::Api
    Properties:
      Name: MyHttpApi
      ProtocolType: HTTP
      CorsConfiguration:
        AllowOrigins:
          - "https://myapp.com"
        AllowMethods:
          - GET
          - POST
          - PUT
          - DELETE
        AllowHeaders:
          - Authorization
          - Content-Type

  JWTAuthorizer:
    Type: AWS::ApiGatewayV2::Authorizer
    Properties:
      ApiId: !Ref HttpApi
      AuthorizerType: JWT
      IdentitySource:
        - $request.header.Authorization
      JwtConfiguration:
        Audience:
          - !Ref UserPoolClient
        Issuer: !Sub 'https://cognito-idp.\${AWS::Region}.amazonaws.com/\${UserPool}'`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#8c5b08' }}>Lambda Authorizer for Custom Logic</h3>
          <p>
            When you need custom authentication logic, Lambda authorizers provide maximum flexibility:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">lambda-authorizer.js</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`exports.handler = async (event) => {
  const token = event.authorizationToken;
  
  try {
    // Custom token validation logic
    const user = await validateToken(token);
    
    // Generate policy
    const policy = generatePolicy(user.userId, 'Allow', event.methodArn);
    
    // Add user context
    policy.context = {
      userId: user.userId,
      email: user.email,
      role: user.role
    };
    
    return policy;
  } catch (error) {
    // Return 401 Unauthorized
    throw new Error('Unauthorized');
  }
};

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  };
}`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Request/Response Transformation Patterns</h2>

          <h3 style={{ color: '#8c5b08' }}>Input Validation with Request Models</h3>
          <p>
            Always validate incoming requests at the gateway level to protect your backend services:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">request-model.json</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "User Registration Model",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "description": "User email address"
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]",
      "description": "Password with complexity requirements"
    },
    "firstName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "lastName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    }
  },
  "required": ["email", "password", "firstName", "lastName"],
  "additionalProperties": false
}`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#8c5b08' }}>Response Transformation for Consistent APIs</h3>
          <p>
            Use mapping templates to ensure consistent response formats across your API:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">response-template.vtl</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`{
  "success": true,
  "data": $input.json('$'),
  "metadata": {
    "requestId": "$context.requestId",
    "timestamp": "$context.requestTime",
    "version": "v1"
  }
}

## Error response template
#if($context.error)
{
  "success": false,
  "error": {
    "message": "$context.error.message",
    "type": "$context.error.messageString"
  },
  "metadata": {
    "requestId": "$context.requestId",
    "timestamp": "$context.requestTime"
  }
}
#end`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Rate Limiting and Throttling Strategies</h2>

          <h3 style={{ color: '#8c5b08' }}>Usage Plans and API Keys</h3>
          <p>
            Implement tiered access with usage plans to monetize your API or provide different service levels:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">usage-plans.yaml</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`Resources:
  # Basic tier - 1000 requests/day, 10 req/sec burst
  BasicUsagePlan:
    Type: AWS::ApiGateway::UsagePlan
    Properties:
      UsagePlanName: Basic
      Description: Basic tier with limited access
      Throttle:
        RateLimit: 5
        BurstLimit: 10
      Quota:
        Limit: 1000
        Period: DAY
      ApiStages:
        - ApiId: !Ref MyApi
          Stage: prod

  # Premium tier - 10000 requests/day, 100 req/sec burst
  PremiumUsagePlan:
    Type: AWS::ApiGateway::UsagePlan
    Properties:
      UsagePlanName: Premium
      Description: Premium tier with higher limits
      Throttle:
        RateLimit: 50
        BurstLimit: 100
      Quota:
        Limit: 10000
        Period: DAY
      ApiStages:
        - ApiId: !Ref MyApi
          Stage: prod`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#8c5b08' }}>Method-Level Throttling</h3>
          <p>
            Apply different rate limits to different endpoints based on their resource requirements:
          </p>

          <ul>
            <li><strong>GET endpoints</strong>: Higher rate limits (100+ req/sec)</li>
            <li><strong>POST/PUT endpoints</strong>: Moderate limits (20-50 req/sec)</li>
            <li><strong>Resource-intensive operations</strong>: Lower limits (5-10 req/sec)</li>
            <li><strong>Authentication endpoints</strong>: Very low limits (1-2 req/sec)</li>
          </ul>

          <h2 style={{ color: '#8c5b08' }}>Error Handling and Circuit Breaker Patterns</h2>

          <h3 style={{ color: '#8c5b08' }}>Gateway-Level Error Responses</h3>
          <p>
            Configure consistent error responses at the gateway level:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">gateway-responses.yaml</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`Resources:
  # 429 Too Many Requests
  ThrottledResponse:
    Type: AWS::ApiGateway::GatewayResponse
    Properties:
      RestApiId: !Ref MyApi
      ResponseType: THROTTLED
      StatusCode: '429'
      ResponseTemplates:
        application/json: |
          {
            "error": {
              "code": "RATE_LIMIT_EXCEEDED",
              "message": "Too many requests. Please try again later.",
              "retryAfter": $context.error.responseOverride.header.Retry-After
            },
            "requestId": "$context.requestId"
          }

  # 401 Unauthorized
  UnauthorizedResponse:
    Type: AWS::ApiGateway::GatewayResponse
    Properties:
      RestApiId: !Ref MyApi
      ResponseType: UNAUTHORIZED
      StatusCode: '401'
      ResponseTemplates:
        application/json: |
          {
            "error": {
              "code": "UNAUTHORIZED",
              "message": "Invalid or missing authentication credentials"
            },
            "requestId": "$context.requestId"
          }`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Monitoring and Observability</h2>

          <h3 style={{ color: '#8c5b08' }}>Essential CloudWatch Metrics</h3>
          <p>
            Monitor these key metrics to ensure API health:
          </p>

          <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-6 mb-6">
            <h4 className="font-bold mb-4 text-secondary-900 dark:text-white">Key Metrics to Track:</h4>
            <ul className="space-y-2">
              <li><strong>4XXError</strong>: Client errors (authentication, validation)</li>
              <li><strong>5XXError</strong>: Server errors (backend failures)</li>
              <li><strong>Latency</strong>: Response time distribution</li>
              <li><strong>Count</strong>: Total number of API calls</li>
              <li><strong>CacheHitCount/CacheMissCount</strong>: Caching effectiveness</li>
              <li><strong>IntegrationLatency</strong>: Backend response time</li>
            </ul>
          </div>

          <h3 style={{ color: '#8c5b08' }}>X-Ray Tracing for Deep Insights</h3>
          <p>
            Enable X-Ray tracing to understand request flows and identify bottlenecks:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">xray-config.yaml</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`Resources:
  MyApi:
    Type: AWS::ApiGateway::RestApi
    Properties:
      Name: MyAPI
      TracingConfig:
        TracingEnabled: true

  MyStage:
    Type: AWS::ApiGateway::Stage
    Properties:
      RestApiId: !Ref MyApi
      StageName: prod
      TracingConfig:
        TracingEnabled: true
      AccessLogSetting:
        DestinationArn: !GetAtt ApiLogGroup.Arn
        Format: |
          {
            "requestId": "$context.requestId",
            "ip": "$context.identity.sourceIp",
            "caller": "$context.identity.caller",
            "user": "$context.identity.user",
            "requestTime": "$context.requestTime",
            "httpMethod": "$context.httpMethod",
            "resourcePath": "$context.resourcePath",
            "status": "$context.status",
            "protocol": "$context.protocol",
            "responseLength": "$context.responseLength"
          }`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Performance Optimization Patterns</h2>

          <h3 style={{ color: '#8c5b08' }}>Caching Strategies</h3>
          <p>
            Implement intelligent caching to reduce backend load and improve response times:
          </p>

          <ul>
            <li><strong>Enable caching per method</strong>: Different TTLs for different endpoints</li>
            <li><strong>Cache key parameters</strong>: Include query strings and headers in cache keys</li>
            <li><strong>Cache invalidation</strong>: Implement cache warming and invalidation strategies</li>
            <li><strong>Conditional caching</strong>: Use cache only for GET requests with specific conditions</li>
          </ul>

          <h3 style={{ color: '#8c5b08' }}>Connection Optimization</h3>
          <p>
            Configure VPC Links and private integrations for better performance and security:
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">vpc-link.yaml</span>
              <div className="w-16"></div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-white">
                {`Resources:
  VpcLink:
    Type: AWS::ApiGateway::VpcLink
    Properties:
      Name: MyVpcLink
      TargetArns:
        - !Ref NetworkLoadBalancer

  PrivateIntegration:
    Type: AWS::ApiGateway::Method
    Properties:
      RestApiId: !Ref MyApi
      ResourceId: !Ref MyResource
      HttpMethod: GET
      AuthorizationType: AWS_IAM
      Integration:
        Type: HTTP_PROXY
        IntegrationHttpMethod: GET
        Uri: http://internal-service.local/api
        ConnectionType: VPC_LINK
        ConnectionId: !Ref VpcLink`}
              </code>
            </pre>
          </div>

          <h2 style={{ color: '#8c5b08' }}>Security Best Practices</h2>

          <h3 style={{ color: '#8c5b08' }}>API Security Checklist</h3>
          <ul>
            <li><strong>Enable CORS properly</strong>: Configure specific origins, not wildcards</li>
            <li><strong>Use HTTPS only</strong>: Redirect HTTP to HTTPS</li>
            <li><strong>Implement proper authentication</strong>: JWT, API keys, or IAM</li>
            <li><strong>Validate all inputs</strong>: Use request models and mapping templates</li>
            <li><strong>Rate limiting</strong>: Protect against abuse and DDoS</li>
            <li><strong>Resource-based policies</strong>: Control access at the API level</li>
            <li><strong>WAF integration</strong>: Protect against common web exploits</li>
          </ul>

          <h2 style={{ color: '#8c5b08' }}>Conclusion</h2>
          <p>
            AWS API Gateway is a powerful service that can handle the complex requirements of modern APIs when configured correctly. By implementing these patterns and best practices, you&apos;ll build APIs that are secure, performant, and maintainable.
          </p>

          <p>
            Start with basic authentication and rate limiting, then gradually add more sophisticated patterns like caching, monitoring, and advanced security features. Remember that a well-designed API Gateway configuration can significantly reduce the complexity of your backend services.
          </p>

          <div className="mt-12 p-6 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
            <p className="text-secondary-700 dark:text-secondary-200 italic mb-0">
              What API Gateway patterns have been most valuable in your projects? Share your experiences with authentication, rate limiting, or monitoring strategies!
            </p>
          </div>
        </div>
        </div>
      </article>
    </div>
  );
}