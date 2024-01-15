export const slidingDifficultyTaskData = {
    taskName: 'Sum of one digit numbers',
    scoreInterpretation: 'The amount of numbers in the sum',
    results: {
        llama: {
            highest_difficulty_passed: 4,
            passed_any: true,
            list: [
                {
                    llm: 'llama',
                    prompt: '3 + 6',
                    answer: '9',
                    passed: true,
                    humanReadableSolution: '9',
                    difficulty: 2
                },
                {
                    llm: 'llama',
                    prompt: '5 + 2 + 9 + 1',
                    answer: '17',
                    passed: true,
                    humanReadableSolution: '17',
                    difficulty: 4
                },
                {
                    llm: 'llama',
                    prompt: '8 + 7 + 9 + 2 + 3 + 2',
                    answer: '18',
                    passed: false,
                    humanReadableSolution: '31',
                    difficulty: 6
                }
            ]
        }
    }
}

export const simpleQATaskData = {
    taskName: 'Apple Test',
    prompt: 'Today, I have three apples. Last week, I ate two apples. How many apples do I have today?',
    humanReadableSolution: 'Two (2)',
    results: {
        llama: {
            highest_difficulty_passed: null,
            passed_any: false,
            list: [
                {
                    llm: 'llama',
                    prompt: 'Today, I have three apples. Last week, I ate two apples. How many apples do I have today?',
                    answer: 'Three',
                    passed: false,
                    humanReadableSolution: 'Two (2)',
                    difficulty: null
                }
            ]
        },
        gpt3_5: {
            highest_difficulty_passed: null,
            passed_any: false,
            list: [
                {
                    llm: 'gpt3_5',
                    prompt: 'Today, I have three apples. Last week, I ate two apples. How many apples do I have today?',
                    answer: 'Three',
                    passed: false,
                    humanReadableSolution: 'Two (2)',
                    difficulty: null
                }
            ]
        },
        gpt4: {
            highest_difficulty_passed: null,
            passed_any: true,
            list: [
                {
                    llm: 'gpt4',
                    prompt: 'Today, I have three apples. Last week, I ate two apples. How many apples do I have today?',
                    answer: 'Two',
                    passed: true,
                    humanReadableSolution: 'Two (2)',
                    difficulty: null
                }
            ]
        }
    }
}