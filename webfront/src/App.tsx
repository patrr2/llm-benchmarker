import { useState, useEffect } from 'react'
import './App.css'

import SlidingDifficultyQuestionCard from './components/SlidingDifficultyQuestionCard'
import SimpleQATask from './components/SimpleQATask'
import { IState } from '../../webserver/sharedTypes'

function App() {
  const [stateFromApi, setStateFromApi] = useState<IState | null>(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/state')
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
