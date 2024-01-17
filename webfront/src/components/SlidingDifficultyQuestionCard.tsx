import {useEffect} from 'react'
import { SlidingDifficultyTaskScoresObject } from '../../../webserver/sharedTypes'
import { ScoreBadge, sortByDifficultyAndPassed } from './ScoreBadge'

export default (props : { task:  SlidingDifficultyTaskScoresObject }) => {
    const { task } = props

    const answerAreaId = "answerarea-"+task.taskName

    useEffect(() => {
        // scroll answerArea to bottom
        const answerArea = document.getElementById(answerAreaId)
        if (answerArea) {
            answerArea.scrollTop = answerArea.scrollHeight
        }
    })

    const sortedEvaluations = sortByDifficultyAndPassed(Object.entries(task.evaluations))
    const topDifficulty = sortedEvaluations[0][1].highestDifficultyPassed
    const topDifficultyPromptExample = sortedEvaluations[0][1].list.filter(x => x.difficulty === topDifficulty)[0]
    const TopDifficultyPromptAnswerJsx = topDifficultyPromptExample.responseText.length > 30 ? <textarea id={answerAreaId} className="w-full h-6">{topDifficultyPromptExample.responseText}</textarea> : topDifficultyPromptExample.responseText
    
    return (
        <div className="w-full rounded-md bg-gray-950 p-4">
            <h4 className="text-lg">{task.taskName}</h4>
            <div className="rounded-md bg-gray-900 p-2">
                <b>Highlighted prompt: </b> {topDifficultyPromptExample.promptText} <br />
                <b>Correct Answer ({topDifficultyPromptExample.llm}): </b> {TopDifficultyPromptAnswerJsx} <br />
            </div>
            <div className="my-2 flex gap-2">
                <b className="leading-8">Scores:</b>
                {
                    sortedEvaluations.map(([key, val]) => <ScoreBadge llmName={key} score={val.highestDifficultyPassed} />)
                }
            </div>

            <i className="text-gray-300 ml-1">Score interpretation: { task.scoreInterpretation } </i> 

        </div>
    )
}