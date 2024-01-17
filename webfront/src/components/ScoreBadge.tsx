import { LLMTaskResult } from "../../../webserver/sharedTypes";

export const sortByDifficulty = (a: number | null, b: number | null) => {
    if (a === null && b === null) {
        return 0;
    }
    if (a === null) {
        return 1;
    }
    if (b === null) {
        return -1;
    }
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

export const sortByPassed = (a: boolean | null, b: boolean | null) => {
    if (a === null && b === null) {
        return 0;
    }
    if (a === null) {
        return 1;
    }
    if (b === null) {
        return -1;
    }
    if (a === b) {
        return 0;
    }
    if (a) {
        return -1;
    }
    return 1;
}

export const sortByDifficultyAndPassed = (list : ([string, LLMTaskResult])[]) => {
    const sort1 = list.sort((a, b) => {
        return -sortByDifficulty(a[1].highestDifficultyPassed, b[1].highestDifficultyPassed)
    })

    const sort2 = sort1.sort((a, b) => {
        return sortByPassed(a[1].passedAny, b[1].passedAny)
    })

    return sort2
}

export const ScoreBadge = (props: { llmName: string; score: number | boolean | null; }) => {
    let colorClass = 'badge-secondary';
    let scoreString = ''

    if (props.score === true) {
        colorClass = 'badge-success';
        scoreString = 'P'
    } else if (props.score === false || props.score === null) {
        colorClass = 'badge-error';
        scoreString = 'F'
    } else {
        scoreString = props.score.toString()
    }

    return (
        <div className="inline-block bg-gray-900 py-1 p-2 rounded-lg">
            <b>{props.llmName}</b>
            <div className={"badge badge-outline ml-2 " + colorClass}>
                {scoreString}
            </div>
        </div>
    );
};
