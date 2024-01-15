import { SlidingDifficultyTask } from "./SlidingDifficultyTask"
import { QuestionAndEvaluation } from "./Task"
import { llms, tasks } from "./app"
import { databaseReady } from './database/database'

const runBenchmark = async () => {
    await databaseReady

    for (const task of tasks) {
        if (task instanceof QuestionAndEvaluation || task instanceof SlidingDifficultyTask) {
            await task.runForUnparticipatedLlms(llms)
        }
    }
}

runBenchmark()