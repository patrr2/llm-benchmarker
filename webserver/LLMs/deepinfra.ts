import LLM from "../LLM";

const apiUrl = "https://api.deepinfra.com/v1/inference/";


export class DeepInfraModel extends LLM {
    generatePrompt = (inputText : string) => {
        return `<s>[INST] ${inputText} [/INST]`
    }

    constructor(modelName : string) {
        super({
            name: modelName,
            getResponse: async (text : string) => {
                console.log(process.env.DEEPINFRA_API_KEY)
                const resp = await fetch(apiUrl + modelName, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`
                    },
                    body: JSON.stringify(this.generatePrompt(text))
                  })
                  .then(response => response.json())
                  
                console.log(resp)
                return resp?.results?.[0]?.generated_text ?? "[error response]"
            }}
        );
    }
}

export const models = [
    new DeepInfraModel("meta-llama/Llama-2-70b-chat-hf")
]