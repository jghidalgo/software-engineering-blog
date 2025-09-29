import { Metadata } from 'next';
import { CodeBracketIcon, CloudIcon, AcademicCapIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About - DevBlog',
  description: 'Learn about DevBlog and our mission to share knowledge about software engineering and AWS cloud technologies.',
};

const stats = [
  { name: 'Articles Published', value: '50+' },
  { name: 'AWS Services Covered', value: '25+' },
  { name: 'Years of Experience', value: '10+' },
  { name: 'Technologies Explored', value: '100+' },
];

const skills = [
  {
    category: 'Frontend',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js'],
    icon: CodeBracketIcon,
  },
  {
    category: 'Backend',
    technologies: ['Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'MongoDB'],
    icon: RocketLaunchIcon,
  },
  {
    category: 'AWS Services',
    technologies: ['Lambda', 'EC2', 'S3', 'RDS', 'API Gateway', 'CloudFormation'],
    icon: CloudIcon,
  },
  {
    category: 'Tools & Practices',
    technologies: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Microservices'],
    icon: AcademicCapIcon,
  },
];

export default function AboutPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            About DevBlog
          </h1>
          <p className="mt-6 text-lg leading-8 text-secondary-600 dark:text-secondary-300">
            Welcome to DevBlog, where we explore the ever-evolving world of software engineering 
            with a special focus on AWS cloud technologies and modern development practices.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mx-auto max-w-4xl mb-20">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-secondary-700 dark:text-secondary-300 mb-6">
              Our mission is to bridge the gap between complex cloud technologies and practical implementation. 
              We believe that knowledge sharing accelerates innovation and helps developers build better, 
              more scalable applications.
            </p>
            <p className="text-lg text-secondary-700 dark:text-secondary-300">
              Whether you&apos;re a seasoned architect or just starting your cloud journey, our content is 
              designed to provide actionable insights, real-world examples, and best practices that 
              you can immediately apply to your projects.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto max-w-4xl mb-20">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col gap-y-4">
                <dt className="text-base leading-7 text-secondary-600 dark:text-secondary-400">
                  {stat.name}
                </dt>
                <dd className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Skills & Technologies */}
        <div className="mx-auto max-w-6xl mb-20">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
              Technologies & Expertise
            </h2>
            <p className="mt-4 text-lg leading-8 text-secondary-600 dark:text-secondary-300">
              We cover a wide range of technologies and practices in our articles
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill) => (
              <div key={skill.category} className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-6 shadow-sm border-2  bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-border relative">
                <div className="bg-secondary-50 dark:bg-secondary-800 rounded-md p-6 -m-6 h-full relative">
                  <div className="flex items-center mb-4">
                    <skill.icon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                      {skill.category}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {skill.technologies.map((tech) => (
                      <li key={tech} className="text-sm text-secondary-600 dark:text-secondary-300">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What You'll Find */}
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
              What You&apos;ll Find Here
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                  In-Depth Tutorials
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  Step-by-step guides that take you from concept to implementation, 
                  complete with code examples and explanations.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                  Best Practices
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  Learn from real-world experience with proven patterns and practices 
                  that lead to maintainable, scalable applications.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                  AWS Deep Dives
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  Comprehensive coverage of AWS services, architectures, and cost optimization 
                  strategies based on hands-on experience.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                  Modern Development
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  Stay updated with the latest trends in software engineering, from new 
                  frameworks to development methodologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
