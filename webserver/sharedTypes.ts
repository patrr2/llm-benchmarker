
export interface LLMSingleResult {
    llm: string
    promptText: string
    responseText: string
    isCorrect: boolean | null
    humanReadableSolution: string | null
    difficulty: number | null
}

export interface LLMTaskEvaluation {
    list: LLMSingleResult[]
    highestDifficultyPassed: number | null
    passedAny: boolean
}

export interface LLMTaskEvaluations {
    [key: string]: LLMTaskEvaluation[]
}

export interface QuestionAndEvaluationScoresObject {
    taskName: string
    promptText: string
    humanReadableSolution: string
    evaluations: { [key: string]: LLMTaskEvaluation} 
}

export interface SlidingDifficultyTaskScoresObject {
    taskName: string
    scoreInterpretation: string
    evaluations: { [key: string]: LLMTaskEvaluation} 
}

export interface IState {
    slidingDifficultyTasksResults: SlidingDifficultyTaskScoresObject[]
    simpleQAResults: QuestionAndEvaluationScoresObject[]
}
