'use client'

import { useState } from 'react'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'
import LandingPage from '@/components/LandingPage'
import Quiz from '@/components/Quiz'
import Results from '@/components/Results'
import AgentContact from '@/components/AgentContact'
import { QuizAnswers, computeEligibility, Program, ProjectRecommendation } from '@/lib/eligibility'

type Screen = 'landing' | 'quiz' | 'results' | 'agent'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [results, setResults] = useState<{
    eligible: boolean
    programs: Program[]
    projects: ProjectRecommendation[]
  } | null>(null)

  function handleQuizComplete(answers: QuizAnswers) {
    const computed = computeEligibility(answers)
    setResults(computed)
    setScreen('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateTo(s: Screen) {
    setScreen(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageNavbar />
      <div className="flex-1">
        {screen === 'landing' && (
          <LandingPage onStart={() => navigateTo('quiz')} />
        )}
        {screen === 'quiz' && (
          <Quiz
            onComplete={handleQuizComplete}
            onBack={() => navigateTo('landing')}
          />
        )}
        {screen === 'results' && results && (
          <Results
            eligible={results.eligible}
            programs={results.programs}
            projects={results.projects}
            onNext={() => navigateTo('agent')}
          />
        )}
        {screen === 'agent' && <AgentContact />}
      </div>
      <Footer />
    </div>
  )
}
