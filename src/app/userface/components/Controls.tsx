'use client'

type ControlsProps = {
  language: string
  theme: string
  input: string
  isLoading: boolean
  onLanguageChange: (value: string) => void
  onThemeChange: (value: string) => void
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function Controls({
  language,
  theme,
  input,
  isLoading,
  onLanguageChange,
  onThemeChange,
  onInputChange,
  onSubmit
}: ControlsProps) {
  return (
    <div className="sticky top-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 border border-gray-100">
        <div className="space-y-6">
          {/* Language & Theme Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select 
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl 
                          transition-all duration-200 ease-in-out
                          hover:bg-gray-50 
                          focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="tamil">Tamil</option>
                <option value="kannada">Kannada</option>
                <option value="telugu">Telugu</option>
                <option value="marathi">Marathi</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select 
                value={theme}
                onChange={(e) => onThemeChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl 
                          transition-all duration-200 ease-in-out
                          hover:bg-gray-50 
                          focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              >
                <option value="fomo">FOMO</option>
                <option value="urgency">Urgency</option>
                <option value="exclusivity">Exclusivity</option>
                <option value="value">Value</option>
                <option value="trust">Trust</option>
                <option value="community">Community</option>
              </select>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Topic</label>
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder="Enter banner topic..."
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl pl-10
                            transition-all duration-200 ease-in-out
                            hover:bg-gray-50
                            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  disabled={isLoading}
                />
                <svg 
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                        text-white font-medium rounded-xl 
                        transition-all duration-200 ease-in-out
                        hover:from-blue-600 hover:to-blue-700 
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-[0_2px_10px_rgb(59,130,246,0.3)]
                        hover:shadow-[0_4px_20px_rgb(59,130,246,0.4)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating...</span>
                </div>
              ) : (
                'Generate'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 