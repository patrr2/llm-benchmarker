import { groupBy, mapObjectValues } from "./utils/common"
import { LLMSingleResponseEvaluationDb } from "./database/models/llm_response_evaluation"
import { LLMSingleResponseEvaluation, LLMTaskResult } from "./sharedTypes"

export interface LLMParams {
    name : string
    getResponse : (prompt : string) => Promise<string>
}

export default class LLM {
    constructor(public p : LLMParams) {}

    get name() {
        return this.p.name
    }

    async getResponse(prompt : string) : Promise<string> {
        return await this.p.getResponse(prompt)
    }
}

const llmSingleResponseEvaluationDbToJson = (evaluation : LLMSingleResponseEvaluationDb) : LLMSingleResponseEvaluation => {
    return {
        llm: evaluation.llm_name,
        promptText: evaluation.prompt_text,
        responseText: evaluation.response_text,
        isCorrect: evaluation.is_correct,
        humanReadableSolution: evaluation.human_readable_solution,
        difficulty: evaluation.difficulty
    }
}

export const llmEvaluationsToLlmTaskResult = (llmEvaluations : LLMSingleResponseEvaluationDb[], passesRequired : number = 1) : LLMTaskResult => {
    const passedEvaluations = llmEvaluations.filter(x => x.is_correct)
    const evaluationsPerDifficulty = groupBy(passedEvaluations, x => x.difficulty?.toString() ?? 'null')

    let passedAny = false
    let highestPassingScore = null

    for (let [score, correctAnswers] of Object.entries(evaluationsPerDifficulty)) {
        if (correctAnswers.length < passesRequired) {
            continue
        }

        passedAny = true

        // rank difficulty if not null (null is for questions without difficulty rating)
        if (score !== 'null') {
            const scoreNum = parseInt(score)
            if (highestPassingScore === null || scoreNum > highestPassingScore) {
                highestPassingScore = scoreNum
            }
        }
    }

    const returnObj : LLMTaskResult = {
        evaluations: llmEvaluations.map(x => llmSingleResponseEvaluationDbToJson(x)),
        highestDifficultyPassed: highestPassingScore,
        passedAny: passedAny
    }

    return returnObj
}