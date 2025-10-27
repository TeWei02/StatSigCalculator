import { useState, useEffect } from 'react'

interface CalculatorInputs {
  baselineRate: number
  minEffect: number
  power: number
  significance: number
}

interface CalculatorResults {
  sampleSizePerVariation: number
  totalSampleSize: number
}

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    baselineRate: 5,
    minEffect: 20,
    power: 80,
    significance: 5
  })

  const [results, setResults] = useState<CalculatorResults | null>(null)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const calculateSampleSize = (params: CalculatorInputs): CalculatorResults => {
    const p1 = params.baselineRate / 100
    const relativeEffect = params.minEffect / 100
    const p2 = p1 * (1 + relativeEffect)
    
    const alpha = params.significance / 100
    const beta = 1 - (params.power / 100)
    
    const zAlpha = getZScore(1 - alpha / 2)
    const zBeta = getZScore(1 - beta)
    
    const pooledP = (p1 + p2) / 2
    const pooledVariance = pooledP * (1 - pooledP)
    
    const numerator = Math.pow(zAlpha * Math.sqrt(2 * pooledVariance) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2)
    const denominator = Math.pow(p2 - p1, 2)
    
    const sampleSizePerVariation = Math.ceil(numerator / denominator)
    const totalSampleSize = sampleSizePerVariation * 2
    
    return {
      sampleSizePerVariation,
      totalSampleSize
    }
  }

  const getZScore = (probability: number): number => {
    const z = Math.sqrt(2) * inverseErrorFunction(2 * probability - 1)
    return z
  }

  const inverseErrorFunction = (x: number): number => {
    const a = 0.147
    const b = 2 / (Math.PI * a) + Math.log(1 - x * x) / 2
    const sqrt1 = Math.sqrt(b * b - Math.log(1 - x * x) / a)
    const sqrt2 = Math.sqrt(sqrt1 - b)
    return sqrt2 * Math.sign(x)
  }

  useEffect(() => {
    try {
      const calculatedResults = calculateSampleSize(inputs)
      setResults(calculatedResults)
    } catch (error) {
      setResults(null)
    }
  }, [inputs])

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setInputs(prev => ({
        ...prev,
        [field]: numValue
      }))
    }
  }

  const tooltips = {
    baselineRate: "The current conversion rate of your control group. For example, if 5 out of 100 visitors convert, enter 5%.",
    minEffect: "The smallest improvement you want to detect. For example, 20% means you want to detect a change from 5% to 6% (a 20% relative improvement).",
    power: "The probability of detecting a real effect if it exists. 80% is the industry standard, meaning you have an 80% chance of detecting the minimum effect.",
    significance: "The probability of incorrectly concluding there's a difference when there isn't. 5% is standard, meaning you're 95% confident in your results."
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-grey mb-3">
            A/B Test Sample Size Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Determine the number of participants needed for statistically significant results
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-input-border p-8 mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-dark-grey">
                    Baseline Conversion Rate (%)
                  </label>
                  <button
                    className="relative"
                    onMouseEnter={() => setShowTooltip('baselineRate')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-google-blue transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {showTooltip === 'baselineRate' && (
                      <div className="absolute z-10 w-64 p-3 bg-dark-grey text-white text-xs rounded-lg shadow-lg -top-2 left-8">
                        {tooltips.baselineRate}
                      </div>
                    )}
                  </button>
                </div>
                <input
                  type="number"
                  value={inputs.baselineRate}
                  onChange={(e) => handleInputChange('baselineRate', e.target.value)}
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent text-dark-grey"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-dark-grey">
                    Minimum Detectable Effect (%)
                  </label>
                  <button
                    className="relative"
                    onMouseEnter={() => setShowTooltip('minEffect')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-google-blue transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {showTooltip === 'minEffect' && (
                      <div className="absolute z-10 w-64 p-3 bg-dark-grey text-white text-xs rounded-lg shadow-lg -top-2 left-8">
                        {tooltips.minEffect}
                      </div>
                    )}
                  </button>
                </div>
                <input
                  type="number"
                  value={inputs.minEffect}
                  onChange={(e) => handleInputChange('minEffect', e.target.value)}
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent text-dark-grey"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-dark-grey">
                    Statistical Power (%)
                  </label>
                  <button
                    className="relative"
                    onMouseEnter={() => setShowTooltip('power')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-google-blue transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {showTooltip === 'power' && (
                      <div className="absolute z-10 w-64 p-3 bg-dark-grey text-white text-xs rounded-lg shadow-lg -top-2 left-8">
                        {tooltips.power}
                      </div>
                    )}
                  </button>
                </div>
                <input
                  type="number"
                  value={inputs.power}
                  onChange={(e) => handleInputChange('power', e.target.value)}
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent text-dark-grey"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-dark-grey">
                    Significance Level (%)
                  </label>
                  <button
                    className="relative"
                    onMouseEnter={() => setShowTooltip('significance')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-google-blue transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {showTooltip === 'significance' && (
                      <div className="absolute z-10 w-64 p-3 bg-dark-grey text-white text-xs rounded-lg shadow-lg -top-2 left-8">
                        {tooltips.significance}
                      </div>
                    )}
                  </button>
                </div>
                <input
                  type="number"
                  value={inputs.significance}
                  onChange={(e) => handleInputChange('significance', e.target.value)}
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent text-dark-grey"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-google-blue to-blue-600 rounded-lg shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Required Sample Size</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium mb-2 opacity-90">Per Variation</p>
                  <p className="text-5xl font-bold">
                    {results.sampleSizePerVariation.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium mb-2 opacity-90">Total Participants</p>
                  <p className="text-5xl font-bold">
                    {results.totalSampleSize.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-dark-grey mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-google-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Understanding Your Results
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>What this means:</strong> You need {results.sampleSizePerVariation.toLocaleString()} participants in each variation (Control and Treatment), 
                  for a total of {results.totalSampleSize.toLocaleString()} participants.
                </p>
                <p>
                  <strong>Statistical Assumptions:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Two-tailed test (can detect both positive and negative effects)</li>
                  <li>Equal sample size allocation between variations</li>
                  <li>{inputs.power}% probability of detecting the {inputs.minEffect}% effect if it exists</li>
                  <li>{100 - inputs.significance}% confidence level (α = {inputs.significance}%)</li>
                  <li>Assumes independent observations and binomial distribution</li>
                </ul>
                <p className="pt-2 border-t border-blue-200">
                  <strong>Recommendation:</strong> Run your test until you reach the calculated sample size before analyzing results. 
                  Stopping early or peeking at results can lead to false conclusions.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Based on standard A/B testing methodology using two-proportion z-test</p>
        </div>
      </div>
    </div>
  )
}

export default App
