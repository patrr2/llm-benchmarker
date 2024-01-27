import {QuestionAndEvaluation} from "../Task";

export default new QuestionAndEvaluation({
    prompt: "What is the name of the shopping centre connected to the metro station of Aalto University?",
    evaluateAnswer: (answer: string) => {
        return answer.includes("A Bloc")
    },
    humanReadableSolution: "A Bloc",
})