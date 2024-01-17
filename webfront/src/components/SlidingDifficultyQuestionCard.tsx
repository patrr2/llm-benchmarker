import {useEffect} from 'react'
import { SlidingDifficultyTaskResultsObject } from '../../../webserver/sharedTypes'
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
    const TopDifficultyPromptAnswerJsx = topDifficultyPromptExample.responseText.length > 30 ? <textarea id={answerAreaId} className="w-full h-6">{topDifficultyPromptExample.responseText}</textarea> : topDifficultyPromptExample.responseText
    
    return (
        <div className="w-full rounded-md bg-gray-950 p-4">
            <h4 className="text-lg">{task.taskName}</h4>
            <div className="rounded-md bg-gray-900 p-2">
                <b>Top Prompt: </b> {topDifficultyPromptExample.promptText} <br />
                <b>Answer: </b> {TopDifficultyPromptAnswerJsx} <br />
            </div>
            <div className="my-2 flex gap-2 ml-1">
                <b className="leading-8">Scores:</b>
                {
                    sortedResults.map(([key, val]) => <ScoreBadge llmName={key} score={val.highestDifficultyPassed} />)
                }
            </div>

            <i className="text-gray-300 ml-1">Score interpretation: { task.scoreInterpretation } </i> 

        </div>
    )
}