export default function TestColorsPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-8">
          Color Visibility Test
        </h1>
        
        <div className="space-y-8">
          <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg border border-secondary-200 dark:border-secondary-700">
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-white mb-4">
              Navigation Colors
            </h2>
            <div className="space-y-4">
              <p className="text-secondary-900 dark:text-secondary-100">
                <strong>Primary text (navigation):</strong> This should be clearly visible
              </p>
              <p className="text-secondary-700 dark:text-secondary-200">
                <strong>Secondary text:</strong> This should be readable but less prominent
              </p>
              <p className="text-secondary-600 dark:text-secondary-300">
                <strong>Tertiary text:</strong> This should be readable for body content
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg border border-secondary-200 dark:border-secondary-700">
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-white mb-4">
              Button Colors
            </h2>
            <div className="flex gap-4 flex-wrap">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg">
                Primary Button
              </button>
              <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-4 py-2 rounded-lg border border-primary-600">
                Secondary Button
              </button>
              <button className="text-secondary-900 dark:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-700 px-4 py-2 rounded-lg">
                Tertiary Button
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg border border-secondary-200 dark:border-secondary-700">
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-white mb-4">
              Link Colors
            </h2>
            <div className="space-y-2">
              <p>
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  This is a primary link - should be clearly visible
                </a>
              </p>
              <p>
                <a href="#" className="text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white">
                  This is a secondary link - should be readable
                </a>
              </p>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-secondary-800/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-white mb-4">
              Card/Section Background
            </h2>
            <p className="text-secondary-700 dark:text-secondary-200">
              This demonstrates text on a colored background. The contrast should be sufficient for readability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
