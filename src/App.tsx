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
  const [error, setError] = useState<string | null>(null)

  const getZScore = (p: number): number => {
    if (p <= 0 || p >= 1) {
      throw new Error('Probability must be between 0 and 1')
    }
    
    if (p === 0.5) return 0
    
    const q = p < 0.5 ? p : 1 - p
    const t = Math.sqrt(-2 * Math.log(q))
    
    const c0 = 2.515517
    const c1 = 0.802853
    const c2 = 0.010328
    const d1 = 1.432788
    const d2 = 0.189269
    const d3 = 0.001308
    
    const numerator = c0 + c1 * t + c2 * t * t
    const denominator = 1 + d1 * t + d2 * t * t + d3 * t * t * t
    const z = t - numerator / denominator
    
    return p < 0.5 ? -z : z
  }

  const calculateSampleSize = (params: CalculatorInputs): CalculatorResults => {
    if (params.baselineRate <= 0 || params.baselineRate >= 100) {
      throw new Error('Baseline conversion rate must be between 0 and 100')
    }
    if (params.minEffect <= 0) {
      throw new Error('Minimum detectable effect must be greater than 0')
    }
    if (params.power <= 0 || params.power >= 100) {
      throw new Error('Statistical power must be between 0 and 100')
    }
    if (params.significance <= 0 || params.significance >= 100) {
      throw new Error('Significance level must be between 0 and 100')
    }
    
    const p1 = params.baselineRate / 100
    const relativeEffect = params.minEffect / 100
    const p2 = p1 * (1 + relativeEffect)
    
    if (p2 > 1) {
      throw new Error('The combination of baseline rate and minimum effect results in an invalid conversion rate (>100%). Please adjust your parameters.')
    }
    
    const alpha = params.significance / 100
    const beta = 1 - (params.power / 100)
    
    const zAlpha = getZScore(1 - alpha / 2)
    const zBeta = getZScore(1 - beta)
    
    if (!isFinite(zAlpha) || !isFinite(zBeta)) {
      throw new Error('Invalid statistical parameters')
    }
    
    const pooledP = (p1 + p2) / 2
    const pooledVariance = pooledP * (1 - pooledP)
    
    const numerator = Math.pow(zAlpha * Math.sqrt(2 * pooledVariance) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2)
    const denominator = Math.pow(p2 - p1, 2)
    
    if (denominator === 0) {
      throw new Error('Minimum detectable effect cannot be zero')
    }
    
    const sampleSizePerVariation = Math.ceil(numerator / denominator)
    const totalSampleSize = sampleSizePerVariation * 2
    
    if (!isFinite(sampleSizePerVariation) || sampleSizePerVariation <= 0) {
      throw new Error('Unable to calculate sample size with the given parameters')
    }
    
    return {
      sampleSizePerVariation,
      totalSampleSize
    }
  }

  useEffect(() => {
    try {
      const calculatedResults = calculateSampleSize(inputs)
      setResults(calculatedResults)
      setError(null)
    } catch (err) {
      setResults(null)
      setError(err instanceof Error ? err.message : 'An error occurred during calculation')
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

        {error && (
          <div className="bg-red-50 border-2 border-warning-red rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-warning-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-warning-red mb-1">Calculation Error</h3>
                <p className="text-sm text-gray-700">{error}</p>
              </div>
            </div>
          </div>
        )}

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
