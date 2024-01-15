import LLM, { llmResultsToLlmTaskEvaluation } from "./LLM"
import LLMSingleResultDB, { LLMSingleResultDBModel } from './database/models/llm_response_evaluation'

export type AnswerAssessment = {
    isCorrect: boolean
    message?: string
} | boolean

export const isCorrect = (answer: AnswerAssessment) => {
    if (typeof answer === "boolean") {
        return answer
    } else {
        return answer.isCorrect
    }
}

export interface QuestionAndEvaluationParams {
    prompt: string,
    evaluateAnswer: ((answer: string) => Promise<AnswerAssessment>) | ((answer: string) => AnswerAssessment),
    description?: string,
    name?: string,
    difficulty?: number
    //passesRequired?: number @todo implement this
    humanReadableSolution?: string
}

import { groupBy, mapObjectValues } from "./utils/common"
import { QuestionAndEvaluationScoresObject } from "./sharedTypes"

export class QuestionAndEvaluation {
    constructor(public p : QuestionAndEvaluationParams) {}

    async buildEvaluation(
        llm : LLM,
        partOfGroup : string | null = null,
    ) : Promise<LLMSingleResultDBModel> {
        console.log(`Running ${llm.name} on '${this.p.prompt}'`)
        const answer = await llm.getResponse(this.p.prompt)
        const evaluation = await this.p.evaluateAnswer(answer)

        const returnObj = LLMSingleResultDB.build({
            llm_name: llm.name,
            prompt_text: this.p.prompt,
            response_text: answer,
            task_name: partOfGroup,
            is_correct: isCorrect(evaluation),
            evaluation_message: typeof evaluation === "boolean" ? undefined : evaluation.message,
            difficulty: this.p.difficulty ?? null,
            human_readable_solution: this.p.humanReadableSolution ?? null
        })

        console.log('Got answer: ', answer)
        console.log(returnObj.is_correct ? 'Correct' : 'Incorrect')
        return returnObj
    }

    async createEvaluation(
        llm : LLM,
        partOfGroup : string | null = null
    ) : Promise<LLMSingleResultDBModel> {
        const evaluation = await this.buildEvaluation(llm, partOfGroup)
        await evaluation.save()
        return evaluation
    }

    async getLlmsParticipated(groupName : string | null = null) {
        // find all llm_name field in db where prompt_text is this.p.prompt and group_name is groupName
        const evaluations = await LLMSingleResultDB.findAll({
            where: {
                prompt_text: this.p.prompt,
                task_name: groupName
            }
        })

        // return all llm_name values
        return evaluations.map(e => e.llm_name)
    }

    async getLlmsCorrect(groupName : string | null = null) {
        // find all llm_name field in db where prompt_text is this.p.prompt and group_name is groupName
        const evaluations = await LLMSingleResultDB.findAll({
            where: {
                prompt_text: this.p.prompt,
                task_name: groupName,
                is_correct: true
            }
        })

        // return all llm_name values
        return evaluations.map(e => e.llm_name)
    }

    async runForUnparticipatedLlms(llms : LLM[]) {
        const participated = await this.getLlmsParticipated()
        const unparticipated = llms.filter(llm => !participated.includes(llm.name))

        console.log('Running for unparticipated llms: ', unparticipated.map(llm => llm.name))
        for (const llm of unparticipated) {
            const passed = (await this.createEvaluation(llm)).is_correct
            console.log(`llm ${llm.name} ${passed ? 'passed' : 'failed'} '${this.p.prompt}'`)
        }

    }

    async getScoresObject() : Promise<QuestionAndEvaluationScoresObject> {
        const results = await LLMSingleResultDB.findAll({
            where: {
                prompt_text: this.p.prompt
            }
        })

        const resultsGroupedByLlms : { [key : string]: LLMSingleResultDBModel[]} = groupBy(results, 'llm_name')
        const evaluationsGroupedByLlms = mapObjectValues(resultsGroupedByLlms, (val) => llmResultsToLlmTaskEvaluation(val, 1))

        return {
            promptText: this.p.prompt,
            humanReadableSolution: this.p.humanReadableSolution ?? "",
            evaluations: evaluationsGroupedByLlms,
            taskName: this.p.name ?? 'Question'
        }
    }
}

