import {QuestionAndEvaluation} from "../Task";

export default new QuestionAndEvaluation({
    prompt: "If dishwashing takes 10 people 10 hours, how many hours does it take for 20 people?",
    evaluateAnswer: (answer: string) => {
        return answer.includes("5 hours") || answer.includes("five hours") || answer.includes("5 h") || answer.includes("5h")
    },
    humanReadableSolution: "A Bloc",
})