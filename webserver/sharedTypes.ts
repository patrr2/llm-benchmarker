
export interface LLMSingleResponseEvaluation {
    llm: string
    promptText: string
    responseText: string
    isCorrect: boolean | null
    humanReadableSolution: string | null
    difficulty: number | null
}

export interface LLMTaskResult {
    evaluations: LLMSingleResponseEvaluation[]
    highestDifficultyPassed: number | null
    passedAny: boolean
}

export interface QuestionAndEvaluationResultsObject {
    taskName: string
    promptText: string
    humanReadableSolution: string
    results: { [key: string]: LLMTaskResult} 
}

export interface SlidingDifficultyTaskResultsObject {
    taskName: string
    scoreInterpretation: string
    results: { [key: string]: LLMTaskResult} 
}

export interface IState {
    slidingDifficultyTasksResults: SlidingDifficultyTaskResultsObject[]
    simpleQAResults: QuestionAndEvaluationResultsObject[]
}
