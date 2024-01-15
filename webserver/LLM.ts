import { groupBy, mapObjectValues } from "./utils/common"
import { LLMSingleResultDBModel } from "./database/models/llm_response_evaluation"
import { LLMSingleResult, LLMTaskEvaluation } from "./sharedTypes"

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

const LLMSingleResultDBModelToLLMSingleResult = (evaluation : LLMSingleResultDBModel) : LLMSingleResult => {
    return {
        llm: evaluation.llm_name,
        promptText: evaluation.prompt_text,
        responseText: evaluation.response_text,
        isCorrect: evaluation.is_correct,
        humanReadableSolution: evaluation.human_readable_solution,
        difficulty: evaluation.difficulty
    }
}

export const llmResultsToLlmTaskEvaluation = (llmResults : LLMSingleResultDBModel[], passesRequired : number = 1) : LLMTaskEvaluation => {
    const passedResults = llmResults.filter(x => x.is_correct)
    const evaluationsPerDifficulty = groupBy(passedResults, x => x.difficulty?.toString() ?? 'null')
    const evaluationsPerDifficultyPassing = mapObjectValues(evaluationsPerDifficulty, x => x.length >= passesRequired)

    let passedAny = false
    let highestPassingScore = null

    for (let [score, passed] of Object.entries(evaluationsPerDifficultyPassing)) {
        if (passed) passedAny = true; else continue

        // rank difficulty if not null (null is for questions without difficulty rating)
        if (score !== 'null') {
            const scoreNum = parseInt(score)
            if (highestPassingScore === null || scoreNum > highestPassingScore) {
                highestPassingScore = scoreNum
            }
        }
    }

    const returnObj : LLMTaskEvaluation = {
        list: llmResults.map(x => LLMSingleResultDBModelToLLMSingleResult(x)),
        highestDifficultyPassed: highestPassingScore,
        passedAny: passedAny
    }

    return returnObj
}