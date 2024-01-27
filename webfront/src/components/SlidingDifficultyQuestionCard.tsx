import {useEffect} from 'react'
import { LLMTaskResult, SlidingDifficultyTaskResultsObject } from '../../../webserver/sharedTypes'
import { ScoreBadge, sortByDifficultyAndPassed } from './ScoreBadge'

export default (props : { task:  SlidingDifficultyTaskResultsObject }) => {
    const { task } = props

    const answerAreaId = "answerarea-"+task.taskName

    useEffect(() => {
        // scroll answerArea to bottom
        const answerArea = document.getElementById(answerAreaId)
        if (answerArea) {
            answerArea.scrollTop = answerArea.scrollHeight
        }
    })

    const sortedResults = sortByDifficultyAndPassed(Object.entries(task.results))
    const topDifficulty = sortedResults[0][1].highestDifficultyPassed
    const topDifficultyPromptExample = sortedResults[0][1].evaluations.filter(x => x.difficulty === topDifficulty)[0]
    const TopDifficultyPromptAnswerJsx = topDifficultyPromptExample.humanReadableSolution
    
    const getEasiestIncorrectEvaluation = (llmTaskResutl : LLMTaskResult) : (string | null) => {
        const sortedEvaluations = llmTaskResutl.evaluations.sort((a, b) => {
            if (a.difficulty === null || b.difficulty === null) {
                return 0
            }

            return a.difficulty - b.difficulty
        })

        const incorrectEvaluations = sortedEvaluations.filter(x => !x.isCorrect)

        if (incorrectEvaluations.length === 0) {
            return null
        }

        const responseText = incorrectEvaluations[0].responseText
        const questionText = incorrectEvaluations[0].promptText

        return `
[The least difficult incorrect answer]:
Question: ${questionText}
Answer: ${responseText}
`
    }

    return (
        <div className="w-full rounded-md bg-gray-950 p-4">
            <h4 className="text-lg">{task.taskName}</h4>
            <div className="rounded-md bg-gray-900 p-2">
                <b>Top Prompt: </b> {topDifficultyPromptExample.promptText} <br />
                <b>Correct Answer: </b> {TopDifficultyPromptAnswerJsx} <br />
            </div>
            <div className="my-2 flex gap-2 ml-1 overflow-auto">
                <b className="leading-8">Scores:</b>
                {
                    sortedResults.map(([key, val]) => <ScoreBadge llmName={key} score={val.highestDifficultyPassed} details={getEasiestIncorrectEvaluation(val)} />)
                }
            </div>

            <i className="text-gray-300 ml-1">Score interpretation: { task.scoreInterpretation } </i> 

        </div>
    )
}