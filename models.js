class Model {
    constructor(config) {
        this.config = config;
        this.history = [];
    }
    async _request() {
        // To be implemented by child class
    }
    async request(obj) {
        const requestObj = { ...obj, type: "request" };
        this.history.push(requestObj);
        const result = await this._request(requestObj);
        const responseObj = { ...requestObj, ...result, type: "response" };
        this.history.push(responseObj);
        return responseObj;
    }
}
class GPT extends Model {
    constructor(config = { model: "gpt-4" }) {
        super(config);
        if (config.system) {
            this.history.push({ role: "system", content: config.system });
        }
    }
    get messages() {
        return this.history.map((item) => ({
            role: item.role || item.type === "request" ? "user" : "assistant",
            content: item.content,
        }));
    }
    async _request(obj) {
        const {
            apiKey,
            model,
            temperature,
            top_p,
            presencePenalty,
            frequencyPenalty,
            maxTokens,
        } = this.config;
        let retryCount = 0;
        while (true) {
            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model,
                        temperature,
                        top_p: topP,
                        presence_penalty: presencePenalty,
                        frequency_penalty: frequencyPenalty,
                        max_tokens: maxTokens,
                        messages: this.messages,
                    }),
                }
            );
            if (!response.ok) {
                if (
                    [500, 502, 429].includes(response.status) &&
                    retryCount < 3
                ) {
                    retryCount++;
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    continue;
                }
                return {
                    content: `API call failed with status ${response.status}`,
                };
            }
            const json = await response.json();
            return { content: json.choices[0].message.content };
        }
    }
}
                      
                      
class Console extends Model {
    constructor(config) {
        super(config);
    }
    async _request(obj) {
        const wrappedContent = `(async () => { ${obj.content} })()`;
        try {
            const result = await eval(wrappedContent);
            return { content: result };
        } catch (error) {
            return { content: `Error: ${error.message}` };
        }
    }
}

const modelConstructors = {
  GPT,
  Console,
};

class AgentManager {
  constructor(defaultInstance = null) {
    this.instances = new Map();
    this.defaultInstance = defaultInstance || new Console();
    this.loadInstancesFromLocalStorage();
  }

  loadInstancesFromLocalStorage() {
    const storedInstances = JSON.parse(localStorage.getItem("instances")) || [];
    for (const { name, classDefinition, config } of storedInstances) {
      this.registerInstance(name, modelConstructors[classDefinition], config);
    }
  }

  saveInstancesToLocalStorage() {
    const instancesToStore = Array.from(this.instances.entries()).map(([name, instance]) => ({
      name,
      classDefinition: instance.constructor.name,
      config: instance.config,
    }));
    localStorage.setItem("instances", JSON.stringify(instancesToStore));
  }

  registerInstance(name, classDefinition, config) {
    const instance = new classDefinition(config);
    this.instances.set(name, instance);
    this.saveInstancesToLocalStorage();
  }

  deleteInstance(name) {
    this.instances.delete(name);
    this.saveInstancesToLocalStorage();
  }

  async request(message, from = 'user') {
    const instanceNameMatch = message.match(/^@(\w+)/);
    let instance;
    let to;

    if (instanceNameMatch) {
      to = instanceNameMatch[1];
      instance = this.instances.get(to);

      if (!instance) {
        return `Error: Instance "${to}" not found.`;
      }

      message = message.replace(/^@\w+\s*/, '');
    } else {
      instance = this.defaultInstance;
    }

    const requestObj = {
      uuid: generateUUID(),
      from,
      to,
      content: message,
    };

    const responseObj = await instance.request(requestObj);
    return responseObj.content;
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}