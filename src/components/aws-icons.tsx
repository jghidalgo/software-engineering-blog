import { useId, type ReactNode } from 'react';

// AWS Architecture Icon palette — service category gradients
// (matches AWS branding guidelines for service icons)
const PALETTE = {
  compute:        ['#C8511B', '#FF9900'] as const, // Lambda, EC2, ECS, Fargate
  storage:        ['#1F8215', '#7AA116'] as const, // S3, EBS, EFS, Glacier
  database:       ['#2E27AD', '#527FFF'] as const, // DynamoDB, RDS, Aurora
  networking:     ['#4D27A8', '#8C4FFF'] as const, // VPC, API Gateway, CloudFront, Route 53
  security:       ['#BD0816', '#DD344C'] as const, // IAM, KMS, WAF
  management:     ['#9B0A4E', '#E7157B'] as const, // CloudWatch, CloudFormation
  appIntegration: ['#9D2EAA', '#E0529C'] as const, // SQS, SNS, EventBridge
  cloud:          ['#161E2D', '#3D4F6B'] as const, // generic AWS cloud
};

interface AwsIconProps {
  className?: string;
  title?: string;
}

interface ShellProps extends AwsIconProps {
  from: string;
  to: string;
  label: string;
  children: ReactNode;
}

function IconShell({ from, to, label, title, className, children }: ShellProps) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      role="img"
      aria-label={title ?? label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`aws-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="10" fill={`url(#aws-${id})`} />
      {children}
    </svg>
  );
}

/* ============================================================
   Compute
   ============================================================ */

export function LambdaIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.compute;
  return (
    <IconShell {...props} from={from} to={to} label="AWS Lambda">
      {/* Greek letter λ — two diagonals from a common apex */}
      <path
        d="M28 22 L35 22 L57 58 L49 58 L40 41 L31 58 L23 58 Z"
        fill="white"
      />
    </IconShell>
  );
}

export function EC2Icon(props: AwsIconProps) {
  const [from, to] = PALETTE.compute;
  return (
    <IconShell {...props} from={from} to={to} label="Amazon EC2">
      {/* Compute instance — chip-style box with pins */}
      <g fill="none" stroke="white" strokeWidth="3" strokeLinecap="square">
        <rect x="24" y="24" width="32" height="32" rx="2" />
        <path d="M30 24 V19 M40 24 V19 M50 24 V19" />
        <path d="M30 61 V56 M40 61 V56 M50 61 V56" />
        <path d="M24 30 H19 M24 40 H19 M24 50 H19" />
        <path d="M61 30 H56 M61 40 H56 M61 50 H56" />
      </g>
      <rect x="32" y="32" width="16" height="16" fill="white" />
    </IconShell>
  );
}

export function FargateIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.compute;
  return (
    <IconShell {...props} from={from} to={to} label="AWS Fargate">
      <g fill="white">
        <rect x="22" y="34" width="16" height="16" rx="2" />
        <rect x="42" y="34" width="16" height="16" rx="2" opacity="0.7" />
        <rect x="32" y="20" width="16" height="10" rx="2" opacity="0.5" />
      </g>
    </IconShell>
  );
}

/* ============================================================
   Storage
   ============================================================ */

export function S3Icon(props: AwsIconProps) {
  const [from, to] = PALETTE.storage;
  return (
    <IconShell {...props} from={from} to={to} label="Amazon S3">
      {/* Bucket */}
      <g fill="white">
        <path d="M22 26 L26 58 Q26 62 40 62 Q54 62 54 58 L58 26 Q58 30 40 30 Q22 30 22 26 Z" />
        <ellipse cx="40" cy="24" rx="18" ry="5" />
        <ellipse cx="40" cy="24" rx="14" ry="3" fill={from} opacity="0.7" />
      </g>
    </IconShell>
  );
}

export function EBSIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.storage;
  return (
    <IconShell {...props} from={from} to={to} label="Amazon EBS">
      <g fill="white" stroke="white">
        <ellipse cx="40" cy="26" rx="16" ry="4" />
        <path d="M24 26 V54 Q24 58 40 58 Q56 58 56 54 V26" fill="none" strokeWidth="3" />
        <path d="M24 40 Q24 44 40 44 Q56 44 56 40" fill="none" strokeWidth="2" opacity="0.7" />
      </g>
    </IconShell>
  );
}

/* ============================================================
   Database
   ============================================================ */

export function DynamoDBIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.database;
  return (
    <IconShell {...props} from={from} to={to} label="Amazon DynamoDB">
      <g fill="white">
        <ellipse cx="40" cy="22" rx="18" ry="5" />
        <path d="M22 22 V36 Q22 41 40 41 Q58 41 58 36 V22" />
        <path d="M22 36 V50 Q22 55 40 55 Q58 55 58 50 V36" opacity="0.85" />
        <path d="M22 50 V60 Q22 65 40 65 Q58 65 58 60 V50" opacity="0.7" />
      </g>
    </IconShell>
  );
}

export function RDSIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.database;
  return (
    <IconShell {...props} from={from} to={to} label="Amazon RDS">
      <g fill="white" stroke="white">
        <ellipse cx="40" cy="24" rx="16" ry="4" />
        <path d="M24 24 V56 Q24 60 40 60 Q56 60 56 56 V24" fill="none" strokeWidth="3" />
        <ellipse cx="40" cy="40" rx="16" ry="4" fill="none" strokeWidth="2" opacity="0.8" />
      </g>
    </IconShell>
  );
}

/* ============================================================
   Networking
   ============================================================ */

export function ApiGatewayIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.networking;
  return (
    <IconShell {...props} from={from} to={to} label="API Gateway">
      <g fill="white">
        {/* Two endpoints connected through a central node */}
        <circle cx="22" cy="40" r="5" />
        <circle cx="58" cy="40" r="5" />
        <circle cx="40" cy="40" r="9" />
        <path d="M27 40 H31 M49 40 H53" stroke="white" strokeWidth="3" />
        <path d="M40 31 V22 M40 49 V58" stroke="white" strokeWidth="3" />
        <circle cx="40" cy="22" r="4" />
        <circle cx="40" cy="58" r="4" />
      </g>
    </IconShell>
  );
}

export function VPCIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.networking;
  return (
    <IconShell {...props} from={from} to={to} label="Amazon VPC">
      <g fill="none" stroke="white" strokeWidth="3">
        <rect x="20" y="20" width="40" height="40" rx="3" strokeDasharray="4 4" />
        <rect x="30" y="30" width="20" height="20" rx="2" fill="white" />
      </g>
    </IconShell>
  );
}

export function CloudFrontIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.networking;
  return (
    <IconShell {...props} from={from} to={to} label="CloudFront">
      <g fill="none" stroke="white" strokeWidth="3">
        <circle cx="40" cy="40" r="18" />
        <ellipse cx="40" cy="40" rx="18" ry="9" />
        <path d="M22 40 H58 M40 22 V58" />
      </g>
    </IconShell>
  );
}

/* ============================================================
   Security
   ============================================================ */

export function IAMIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.security;
  return (
    <IconShell {...props} from={from} to={to} label="AWS IAM">
      {/* Shield with a checkmark */}
      <path
        d="M40 18 L60 24 L60 42 Q60 56 40 62 Q20 56 20 42 L20 24 Z"
        fill="white"
      />
      <path
        d="M30 40 L37 47 L51 33"
        stroke={from}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconShell>
  );
}

export function KMSIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.security;
  return (
    <IconShell {...props} from={from} to={to} label="AWS KMS">
      <g fill="white">
        <rect x="24" y="36" width="32" height="22" rx="2" />
        <path d="M30 36 V28 Q30 20 40 20 Q50 20 50 28 V36" fill="none" stroke="white" strokeWidth="4" />
        <circle cx="40" cy="46" r="3" fill={from} />
      </g>
    </IconShell>
  );
}

/* ============================================================
   Management & Monitoring
   ============================================================ */

export function CloudWatchIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.management;
  return (
    <IconShell {...props} from={from} to={to} label="Amazon CloudWatch">
      <g fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
        <circle cx="40" cy="40" r="16" />
        <path d="M40 40 L40 28" strokeWidth="3" />
        <path d="M40 40 L50 46" strokeWidth="3" />
      </g>
      <circle cx="40" cy="40" r="2.5" fill="white" />
    </IconShell>
  );
}

export function CloudFormationIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.management;
  return (
    <IconShell {...props} from={from} to={to} label="AWS CloudFormation">
      <g fill="white">
        <rect x="22" y="22" width="16" height="16" rx="2" />
        <rect x="42" y="22" width="16" height="16" rx="2" opacity="0.75" />
        <rect x="22" y="42" width="16" height="16" rx="2" opacity="0.75" />
        <rect x="42" y="42" width="16" height="16" rx="2" opacity="0.5" />
      </g>
    </IconShell>
  );
}

/* ============================================================
   Application Integration
   ============================================================ */

export function SQSIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.appIntegration;
  return (
    <IconShell {...props} from={from} to={to} label="Amazon SQS">
      <g fill="white">
        <rect x="22" y="34" width="10" height="12" rx="1" />
        <rect x="35" y="34" width="10" height="12" rx="1" opacity="0.8" />
        <rect x="48" y="34" width="10" height="12" rx="1" opacity="0.6" />
        <path d="M16 40 H22 M58 40 H64" stroke="white" strokeWidth="3" />
      </g>
    </IconShell>
  );
}

export function SNSIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.appIntegration;
  return (
    <IconShell {...props} from={from} to={to} label="Amazon SNS">
      <g fill="white">
        <circle cx="40" cy="40" r="8" />
        <path d="M40 22 L40 30 M40 50 L40 58 M22 40 L30 40 M50 40 L58 40 M28 28 L33 33 M47 47 L52 52 M28 52 L33 47 M47 33 L52 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </g>
    </IconShell>
  );
}

/* ============================================================
   Brand marks
   ============================================================ */

/**
 * The AWS word mark — "aws" + the Smile (signature underline arrow).
 * `currentColor` lets the type adapt to light/dark surfaces.
 */
export function AwsSmileLogo({ className, title }: AwsIconProps) {
  return (
    <svg
      viewBox="0 0 320 160"
      className={className}
      role="img"
      aria-label={title ?? 'AWS'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50%"
        y="92"
        fontFamily="Inter, Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="86"
        letterSpacing="-2"
        fill="currentColor"
        textAnchor="middle"
      >
        aws
      </text>
      {/* The signature "smile" — an arrow swooping under the wordmark */}
      <path
        d="M 80 118 Q 160 152 240 118"
        stroke="#FF9900"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 232 110 L 242 118 L 232 126"
        stroke="#FF9900"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Generic "AWS Cloud" badge — useful for hero illustrations.
 */
export function AwsCloudIcon(props: AwsIconProps) {
  const [from, to] = PALETTE.cloud;
  return (
    <IconShell {...props} from={from} to={to} label="AWS Cloud">
      <g fill="white">
        <path d="M30 50 Q22 50 22 42 Q22 34 30 34 Q31 26 40 26 Q49 26 50 34 Q58 34 58 42 Q58 50 50 50 Z" />
      </g>
      <path
        d="M30 56 Q40 62 50 56"
        stroke="#FF9900"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </IconShell>
  );
}
