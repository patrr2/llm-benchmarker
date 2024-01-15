import {QuestionAndEvaluation} from "../Task";

export default new QuestionAndEvaluation({
    prompt: "Today, I have three apples. Last week, I ate two apples. How many apples do I have today? Only Give the final answer, no other text.",
    evaluateAnswer: (answer: string) => {
        answer = answer.toLowerCase()
        return (answer.includes("three") || answer.includes("3")) && (!answer.includes("one") && !answer.includes("1") && !answer.includes("two") && !answer.includes("2"))
    },
    humanReadableSolution: "Three",
})
