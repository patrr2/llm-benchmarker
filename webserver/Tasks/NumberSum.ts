import {SlidingDifficultyTask} from "../SlidingDifficultyTask"
import { QuestionAndEvaluation } from "../Task"

export default new SlidingDifficultyTask({
    name: 'NumberSum',
    humanReadableSolution: "Give the sum of given single digit numbers",
    difficultyInterpretation: "The amount of numbers in the sum. 10 Passes required",
    minDifficulty: 2,
    maxDifficulty: 200,
    passesRequiredPerDifficulty: 10,
    triesPerDifficulty: 10,
    generateQuestion: async (difficulty : number) => {
        const rand = () => Math.floor(Math.random() * 10)

        const firstNumber = rand()
        let sumString = String(firstNumber)
        let sum = firstNumber

        for (let i = 0; i < difficulty; i++) {
            const number = rand()
            sumString += " + " + number
            sum += number
        }

        return new QuestionAndEvaluation({
            prompt: `${sumString} = ? (only give the final answer, no other text)`,
            difficulty: difficulty,
            humanReadableSolution: String(sum),
            evaluateAnswer: (solution: string) => {
                return solution.includes(String(sum))
            }
        })
    }
})