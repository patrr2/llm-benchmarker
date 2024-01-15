import {QuestionAndEvaluation} from "../Task";

export default new QuestionAndEvaluation({
    prompt: "What could 'SD to LA' mean?",
    evaluateAnswer: (answer: string) => {
        return answer.includes("San Diego") && answer.includes("Los Angeles")
    },
    humanReadableSolution: "San Diego to Los Angeles",
})