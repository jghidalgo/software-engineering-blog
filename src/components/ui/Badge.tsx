interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'aws';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  default:
    'bg-secondary-100 text-secondary-700 ring-1 ring-inset ring-secondary-200/70 dark:bg-white/[0.04] dark:text-secondary-300 dark:ring-white/10',
  primary:
    'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200/70 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-400/20',
  secondary:
    'bg-secondary-100 text-secondary-700 ring-1 ring-inset ring-secondary-200/70 dark:bg-white/[0.04] dark:text-secondary-300 dark:ring-white/10',
  success:
    'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  warning:
    'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
  danger:
    'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/70 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20',
  aws:
    'bg-aws-smile/10 text-aws-smile ring-1 ring-inset ring-aws-smile/30',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
