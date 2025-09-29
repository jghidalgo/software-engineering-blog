'use client';

import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const contactInfo = [
  {
    name: 'Email',
    description: 'Get in touch via email',
    contact: 'joanrodr@gmail.com',
    icon: EnvelopeIcon,
  },
  {
    name: 'Phone',
    description: 'Call us for urgent matters',
    contact: '+1 (555) 123-4567',
    icon: PhoneIcon,
  },
  {
    name: 'Location',
    description: 'Based in the cloud',
    contact: 'Remote, Worldwide',
    icon: MapPinIcon,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset the success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Contact form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg leading-8 text-secondary-600 dark:text-secondary-300">
            Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8">
                Contact Information
              </h2>
              <div className="space-y-8">
                {contactInfo.map((item) => (
                  <div key={item.name} className="flex items-start">
                    <div className="flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-300 mb-1">
                        {item.description}
                      </p>
                      <p className="text-primary-600 dark:text-primary-400">
                        {item.contact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                  Follow Us
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                  Stay updated with our latest articles and cloud insights.
                </p>
                <div className="flex space-x-4">
                  <a href="https://x.com/Joan57002536" className="text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    <span className="sr-only">X (Twitter)</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com/in/joan-rodriguez-hidalgo-56a2a" className="text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="https://github.com/jghidalgo" className="text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://dev.to/jghidalgo" className="text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    <span className="sr-only">Dev.to</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45c.56-.02.82-.13 1.14-.42.32-.29.5-.66.5-1.11s-.18-.84-.5-1.13c-.32-.29-.78-.42-1.14-.42-.18 0-.37.07-.55.23zm12.39 4.13c-.18-.16-.46-.23-.84-.23h-.58l.02 2.44.04 2.45c.56-.02.82-.13 1.14-.42.32-.29.5-.66.5-1.11s-.18-.84-.5-1.13c-.32-.29-.78-.42-1.14-.42-.18 0-.37.07-.55.23zM24 12.02c0 6.628-5.373 12-12 12S0 18.648 0 12.02C0 5.394 5.373.02 12 .02s12 5.374 12 11.98zm-5.39-.645c.57.124.84.457.84 1.011 0 .337-.211.750-.498.993-.287.244-.707.414-1.26.414-.553 0-.97-.17-1.257-.414-.287-.244-.498-.656-.498-.993 0-.337.211-.75.498-.993.287-.244.707-.414 1.26-.414.553 0 .97.17 1.257.414.287.244.498.656.498.993zm-.84-1.011c-.57-.124-.84-.457-.84-1.011 0-.337.211-.75.498-.993.287-.244.707-.414 1.26-.414.553 0 .97.17 1.257.414.287.244.498.656.498.993 0 .337-.211.75-.498.993-.287.244-.707.414-1.26.414-.553 0-.97-.17-1.257-.414z"/>
                    </svg>
                  </a>
                  <a href="https://awsmindset.com/" className="text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    <span className="sr-only">AWS Mindset Blog</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8">
                Send us a Message
              </h2>
              
              {isSubmitted ? (
                <div className="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-green-800 dark:text-green-200">
                    Thanks for your message! We&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="w-full px-4 py-3 text-base text-secondary-900 placeholder-secondary-500 bg-white border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-700 dark:border-secondary-600 dark:text-white dark:placeholder-secondary-400 dark:focus:ring-primary-400 dark:focus:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="w-full px-4 py-3 text-base text-secondary-900 placeholder-secondary-500 bg-white border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-700 dark:border-secondary-600 dark:text-white dark:placeholder-secondary-400 dark:focus:ring-primary-400 dark:focus:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 text-base text-secondary-900 placeholder-secondary-500 bg-white border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-700 dark:border-secondary-600 dark:text-white dark:placeholder-secondary-400 dark:focus:ring-primary-400 dark:focus:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 text-base text-secondary-900 placeholder-secondary-500 bg-white border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-700 dark:border-secondary-600 dark:text-white dark:placeholder-secondary-400 dark:focus:ring-primary-400 dark:focus:border-primary-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Your message..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
