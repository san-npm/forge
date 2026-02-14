'use client'

import { useState } from 'react'
import { LanguageProvider } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import LandingPage from '@/components/LandingPage'
import Quiz from '@/components/Quiz'
import Results from '@/components/Results'
import AgentContact from '@/components/AgentContact'
import Blog from '@/components/Blog'
import Directory from '@/components/Directory'
import { QuizAnswers, computeEligibility, Program, ProjectRecommendation } from '@/lib/eligibility'

type Screen = 'landing' | 'quiz' | 'results' | 'agent' | 'blog' | 'directory'

function SimulatorApp() {
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
    <>
      <Navbar onNavigate={(s) => navigateTo(s as Screen)} />
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
      {screen === 'blog' && <Blog onBack={() => navigateTo('landing')} />}
      {screen === 'directory' && <Directory onBack={() => navigateTo('landing')} />}
    </>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <SimulatorApp />
    </LanguageProvider>
  )
}
