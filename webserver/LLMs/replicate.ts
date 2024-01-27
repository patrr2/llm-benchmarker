import LLM from "../LLM";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export class ReplicateModel extends LLM {
    generatePrompt = (inputText : string) => {
        return `<s>[INST] ${inputText} [/INST]`
    }

    constructor(modelName : `${string}/${string}`) {
        super({
            name: modelName,
            getResponse: async (text : string) => {
                const resp = await replicate.run(modelName, { input: { prompt: this.generatePrompt(text) } })
                if (Array.isArray(resp)) {
                    return resp.join('')
                }

                throw new Error("unexpected response format " + JSON.stringify(resp))
            }}
        );
    }
}

export const models = [
    new ReplicateModel("meta/llama-2-70b-chat"),
    new ReplicateModel("meta/llama-2-7b-chat")
]
