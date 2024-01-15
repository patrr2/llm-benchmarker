import { useState, useEffect } from 'react'
import './App.css'

import SlidingDifficultyQuestionCard from './components/SlidingDifficultyQuestionCard'
import SimpleQATask from './components/SimpleQATask'
import { IState } from '../../webserver/sharedTypes'

function App() {
  const [stateFromApi, setStateFromApi] = useState<IState | null>(null)

  const apiUrl = 'https://llm-bench.adaptable.app/api/state' // note: hardcoded for now before serverside rendering or next.js

  useEffect(() => {
    fetch(apiUrl)
      .then(async (res) => {
        return res.json()
      })
      .then((data) => setStateFromApi(data))
  }, [])

  return (
    <>
      <h1 className="pb-10">LLM Benchmarker</h1>
      <div className="flex flex-col gap-5">
        {
          stateFromApi?.slidingDifficultyTasksResults?.map((task) => (
            <SlidingDifficultyQuestionCard task={task} />
          )) ?? 'Loading...'
        }
        {
          stateFromApi?.simpleQAResults?.map((task) => (
            <SimpleQATask task={task} />
          ))
        }
      </div>
      <p className="text-gray-100 mt-5">
      this project on  <a href="https://github.com/pattr2">github</a>
      </p>
    </>
  )
}

export default App
