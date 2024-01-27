import express from 'express'
import cors from 'cors'
import NumberSum from './Tasks/NumberSum'
import PreviousAppleEating from './Tasks/PreviousAppleEating'
import SDToLA from './Tasks/SDToLA'
import { QuestionAndEvaluation } from './Task'
import models from './LLMs/openai-models'
import { models as replicateModels } from './LLMs/replicate'
import LLM from './LLM'
import { SlidingDifficultyTask } from './SlidingDifficultyTask'
import { IState } from './sharedTypes'
import WordCount from './Tasks/WordCount'

export const app = express()

export const tasks : (QuestionAndEvaluation | SlidingDifficultyTask)[] = [
    NumberSum,
    PreviousAppleEating,
    SDToLA,
    WordCount
]

export const llms : LLM[] = [
    ...models,
    ...replicateModels
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
            const results = await task.getResultsObject()
            tempState.slidingDifficultyTasksResults.push(results)
        }
        else if (task instanceof QuestionAndEvaluation) {
            const results = await  task.getResultsObject()
            tempState.simpleQAResults.push(results)
        }
    }

    state.slidingDifficultyTasksResults = tempState.slidingDifficultyTasksResults
    state.simpleQAResults = tempState.simpleQAResults
}

const fetching = fetchLatestState()

app.use(cors())

app.get('/api/state', async (req, res) => {
    console.log('received request for state')
    await fetching;
    res.send(state)
})

;(async () => {
    await fetching;
    console.log('succesfully fetched latest state')
})()
