import express from 'express'
import cors from 'cors'
import NumberSum from './Tasks/NumberSum'
import PreviousAppleEating from './Tasks/PreviousAppleEating'
import SDToLA from './Tasks/SDToLA'
import { QuestionAndEvaluation } from './Task'
import models from './LLMs/openai-models'
import LLM from './LLM'
import { SlidingDifficultyTask } from './SlidingDifficultyTask'
import { slidingDifficultyTaskData, simpleQATaskData } from './testData'
import { IState } from './sharedTypes'

export const app = express()

export const tasks : (QuestionAndEvaluation | SlidingDifficultyTask)[] = [
    NumberSum,
    PreviousAppleEating,
    SDToLA
]

export const llms : LLM[] = [
    ...models
]

const state : IState = {
    slidingDifficultyTasksResults: [],
    simpleQAResults: []
}

const fetchLatestState = async () => {
    const tempState : IState = {
        slidingDifficultyTasksResults: [],
        simpleQAResults: []
    }

    for (const task of tasks) {
        if (task instanceof SlidingDifficultyTask) {
            const results = await task.getScoresObject()
            tempState.slidingDifficultyTasksResults.push(results)
        }
        else if (task instanceof QuestionAndEvaluation) {
            const results = await  task.getScoresObject()
            tempState.simpleQAResults.push(results)
        }
    }

    state.slidingDifficultyTasksResults = tempState.slidingDifficultyTasksResults
    state.simpleQAResults = tempState.simpleQAResults
}

app.use(cors())

app.get('/api/state', async (req, res) => {
    console.log('received request for state')
    await fetchLatestState()
    res.send(state)
})

app.get('/api/test_state', async (req, res) => {
    res.jsonp({
        slidingDifficultyTasksResults: [slidingDifficultyTaskData],
        simpleQAResults: [simpleQATaskData]
    })
})