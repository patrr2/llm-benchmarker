import LLM from "../LLM";
import OpenAI from "openai";

const openai = new OpenAI();

export class OpenAILLMModel extends LLM {
    constructor(modelName : string) {
        super({
            name: modelName,
            getResponse: async (prompt : string) => {
                const completion = await openai.chat.completions.create({
                    messages: [
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    model: modelName,
                });
                
                return completion.choices[0].message.content ?? "[no response]"
            }}
        );
    }
}

const models = [
    new OpenAILLMModel("gpt-3.5-turbo"),
    new OpenAILLMModel("gpt-4-1106-preview")
]

export default models