export type ValueOf<T> = T[keyof T];

export const mapObjectValues = <InputObj extends Object, OutputValue>(object : InputObj, mapValFn : (value: ValueOf<InputObj>, key: string) => OutputValue) : {[key: string]: OutputValue} => {
    const returnObj : any = {}

    for (const key in object) {
        returnObj[key] = mapValFn(object[key], key)
    }

    return returnObj as {[key: string]: OutputValue}
}

export const groupBy = <T>(array : T[], keyFn : string | ((item : T) => string)) : {[key : string]: T[]} => {
    if (typeof keyFn === "string") {
        const key = keyFn
        keyFn = (item : T) => (item as any)[key]
    }
    
    const returnObj : {[key : string]: T[]} = {}

    for (const item of array) {
        const key = keyFn(item)
        returnObj[key] ??= []
        returnObj[key].push(item)
    }

    return returnObj
}