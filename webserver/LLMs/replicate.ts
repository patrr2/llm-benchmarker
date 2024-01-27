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
                const resp = await replicate.run(
                    modelName,
                    {
                        input: { prompt: this.generatePrompt(text), max_new_tokens: 1024 }
                    }
                )
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
    new ReplicateModel("meta/llama-2-7b-chat"),
    new ReplicateModel("mistralai/mixtral-8x7b-instruct-v0.1"),
    new ReplicateModel("mistralai/mistral-7b-instruct-v0.2")
]
