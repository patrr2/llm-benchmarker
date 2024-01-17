import LLM, { llmEvaluationsToLlmTaskResult } from './LLM'
import { LLMSingleResponseEvaluationDb, LLMSingleResponseEvaluationModel } from './database/models/llm_response_evaluation'
import { QuestionAndEvaluation } from './Task'
import { groupBy, mapObjectValues } from './utils/common'
import { SlidingDifficultyTaskResultsObject } from './sharedTypes'

export interface SlidingDifficultyTaskParams {
    name: string
    generateQuestion : (difficulty : number) => Promise<QuestionAndEvaluation>
    difficultyInterpretation: string
    minDifficulty: number
    maxDifficulty: number
    passesRequiredPerDifficulty: number
    triesPerDifficulty: number
    humanReadableSolution?: string
}

export class SlidingDifficultyTask {
    get name() {
        return this.p.name
    }
    
    constructor(public p : SlidingDifficultyTaskParams) {}

    // perform a binary search to find the max difficulty the llm can handle
    async createEvaluation(llm : LLM) : Promise<number | null> {
        let minDifficulty = this.p.minDifficulty
        let maxDifficulty = this.p.maxDifficulty
        let passesRequiredPerDifficulty = this.p.passesRequiredPerDifficulty
        let triesPerDifficulty = this.p.triesPerDifficulty

        // store result objects to save to database later (if no runtime errors / termination occur)
        const pendingEvaluations : LLMSingleResponseEvaluationDb[] = []

        const passesYTimesWithNTries = async (difficulty : number, y : number = 10, n : number = 10) => {
            let times = 0

            for (let i = 0; i < n; i++) {
                console.log(`task sub evaluation (llm: ${llm.name}, task: ${this.p.name}, difficulty: ${difficulty}, try: ${i+1}/${n})`)
                const sample = await this.p.generateQuestion(difficulty)
                const evaluation = await sample.buildEvaluation(llm, this.p.name)

                pendingEvaluations.push(evaluation)

                if (evaluation.is_correct) {
                    times++
                    if (times >= y) {
                        // enough passes to pass this difficulty
                        return true
                    }
                } else {
                    if (n - i + times <= y) {
                        // can't get enough passes anymore, give up on this difficulty
                        return false
                    }
                }
            }

            return false
        }

        // binary search
        while (minDifficulty <= maxDifficulty) {
            const mid = Math.floor((minDifficulty + maxDifficulty) / 2)

            if (await passesYTimesWithNTries(mid, passesRequiredPerDifficulty, triesPerDifficulty)) {
                minDifficulty = mid + 1
            } else {
                maxDifficulty = mid - 1
            }
        }

        // save all results to database
        await Promise.all(pendingEvaluations.map(e => e.save()))

        return minDifficulty - 1
    }

    async getLlmsParticipated() {
        // find llms where group_name is this.p.name
        const evaluations = await LLMSingleResponseEvaluationModel.findAll({
            where: {
                task_name: this.p.name
            }
        })

        // return all llm_name values
        return evaluations.map(e => e.llm_name)
    }

    async runForUnparticipatedLlms(llms : LLM[]) {
        const participated = await this.getLlmsParticipated()
        const unparticipated = llms.filter(llm => !participated.includes(llm.name))

        for (const llm of unparticipated) {
            const difficulty = await this.createEvaluation(llm)
            console.log(`llm ${llm.name} can handle difficulty ${difficulty}`)
        }
    }

    async getResultsObject() : Promise<SlidingDifficultyTaskResultsObject> {
        const results = await LLMSingleResponseEvaluationModel.findAll({
            where: {
                task_name: this.p.name
            }
        })

        const evaluationsByLlms : { [key : string]: LLMSingleResponseEvaluationDb[]} = groupBy(results, 'llm_name')
        const resultsByLlms = mapObjectValues(evaluationsByLlms, (val) => llmEvaluationsToLlmTaskResult(val, this.p.passesRequiredPerDifficulty))

        return {
            taskName: this.p.name,
            scoreInterpretation: this.p.difficultyInterpretation,
            results: resultsByLlms
        }
    }
}


