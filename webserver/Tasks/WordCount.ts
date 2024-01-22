import {SlidingDifficultyTask} from "../SlidingDifficultyTask"
import { QuestionAndEvaluation } from "../Task"
import { toWords } from 'number-to-words'


export default new SlidingDifficultyTask({
    name: 'WordCount',
    humanReadableSolution: "Number of words 'apple' in the string",
    difficultyInterpretation: "The correct number of apples in the string. 5 Passes required",
    minDifficulty: 2,
    maxDifficulty: 300,
    passesRequiredPerDifficulty: 7,
    triesPerDifficulty: 7,
    generateQuestion: async (difficulty : number) => {
        const apples = new Array(difficulty).fill(undefined).map(x => 'apple')
        const applesString = apples.join(' ')

        return new QuestionAndEvaluation({
            prompt: `How many words are in the following string: '${applesString}'?`,
            difficulty: difficulty,
            humanReadableSolution: String(difficulty),
            evaluateAnswer: (solution: string) => {
                let lowerCase = solution.toLocaleLowerCase()
                return lowerCase.includes(String(difficulty)) || lowerCase.includes(toWords(difficulty))
            }
        })
    }
})