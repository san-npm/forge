'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { QuizAnswers } from '@/lib/eligibility'

interface QuizProps {
  onComplete: (answers: QuizAnswers) => void
  onBack: () => void
}

interface QuestionOption {
  labelKey: string
  value: string
}

interface Question {
  titleKey: string
  options: QuestionOption[]
  answerKey: keyof QuizAnswers
}

const questions: Question[] = [
  {
    titleKey: 'q1.title',
    answerKey: 'companySize',
    options: [
      { labelKey: 'q1.o1', value: 'solo' },
      { labelKey: 'q1.o2', value: '1-10' },
      { labelKey: 'q1.o3', value: '11-50' },
      { labelKey: 'q1.o4', value: '51-250' },
      { labelKey: 'q1.o5', value: '250+' },
    ],
  },
  {
    titleKey: 'q2.title',
    answerKey: 'sector',
    options: [
      { labelKey: 'q2.o1', value: 'horeca' },
      { labelKey: 'q2.o2', value: 'retail' },
      { labelKey: 'q2.o3', value: 'crafts' },
      { labelKey: 'q2.o4', value: 'services' },
      { labelKey: 'q2.o5', value: 'manufacturing' },
      { labelKey: 'q2.o6', value: 'wine-agriculture' },
      { labelKey: 'q2.o7', value: 'other' },
    ],
  },
  {
    titleKey: 'q3.title',
    answerKey: 'luxembourgStatus',
    options: [
      { labelKey: 'q3.o1', value: 'yes-both' },
      { labelKey: 'q3.o2', value: 'yes-no-permit' },
      { labelKey: 'q3.o3', value: 'grande-region' },
      { labelKey: 'q3.o4', value: 'no' },
    ],
  },
  {
    titleKey: 'q4.title',
    answerKey: 'digitalMaturity',
    options: [
      { labelKey: 'q4.o1', value: 'nothing' },
      { labelKey: 'q4.o2', value: 'basic-site' },
      { labelKey: 'q4.o3', value: 'site-social' },
      { labelKey: 'q4.o4', value: 'management-tools' },
    ],
  },
  {
    titleKey: 'q5.title',
    answerKey: 'biggestProblem',
    options: [
      { labelKey: 'q5.o1', value: 'find-clients' },
      { labelKey: 'q5.o2', value: 'manage-admin' },
      { labelKey: 'q5.o3', value: 'communicate' },
      { labelKey: 'q5.o4', value: 'save-time' },
      { labelKey: 'q5.o5', value: 'other' },
    ],
  },
  {
    titleKey: 'q6.title',
    answerKey: 'aiUsage',
    options: [
      { labelKey: 'q6.o1', value: 'never' },
      { labelKey: 'q6.o2', value: 'a-little' },
      { labelKey: 'q6.o3', value: 'regularly' },
    ],
  },
]

export default function Quiz({ onComplete, onBack }: QuizProps) {
  const { t } = useLanguage()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [direction, setDirection] = useState<'right' | 'left'>('right')

  const question = questions[currentQ]
  const totalQuestions = questions.length
  const progress = ((currentQ + 1) / totalQuestions) * 100
  const currentAnswer = answers[question.answerKey]

  function selectOption(value: string) {
    const newAnswers = { ...answers, [question.answerKey]: value }
    setAnswers(newAnswers)

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQ < totalQuestions - 1) {
        setDirection('right')
        setCurrentQ(currentQ + 1)
      }
    }, 300)
  }

  function goBack() {
    if (currentQ > 0) {
      setDirection('left')
      setCurrentQ(currentQ - 1)
    } else {
      onBack()
    }
  }

  function handleComplete() {
    onComplete(answers as QuizAnswers)
  }

  const isLastQuestion = currentQ === totalQuestions - 1
  const canComplete = isLastQuestion && currentAnswer

  return (
    <div className="min-h-screen flex flex-col pt-20">
      {/* Progress bar */}
      <div className="px-4 sm:px-8 pt-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              {t('quiz.progress')} {currentQ + 1} {t('quiz.of')} {totalQuestions}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div
          key={currentQ}
          className={`max-w-2xl w-full ${direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            {t(question.titleKey)}
          </h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => selectOption(option.value)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                  currentAnswer === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-100'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      currentAnswer === option.value
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {currentAnswer === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-base sm:text-lg font-medium">
                    {t(option.labelKey)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 sm:px-8 pb-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('quiz.back')}
          </button>

          {canComplete && (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transition-all"
            >
              {t('quiz.seeResults')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
