import { QuestionAndEvaluationScoresObject } from '../../../webserver/sharedTypes'
import { ScoreBadge, sortByDifficultyAndPassed } from './ScoreBadge'


export default (props : { task:  QuestionAndEvaluationScoresObject }) => {
    const { task } = props

    return (
        <div className="w-full rounded-md bg-gray-950 p-4">
            <h4 className="text-lg">{task.taskName}</h4>
            <div className="rounded-md bg-gray-900 p-2">
                <b>Prompt: </b> {task.promptText} <br />
                <b>Solution: </b> {task.humanReadableSolution} <br />
            </div>
            <div className="my-2 flex gap-2 ml-1">
                <b className="leading-8">Scores:</b>
                {
                    sortByDifficultyAndPassed(Object.entries(task.evaluations)).map(([key, val]) => <ScoreBadge llmName={key} score={val.passedAny} />)
                }
            </div>

        </div>
    )
}