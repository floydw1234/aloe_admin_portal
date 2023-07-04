import openai
from os import environ as env

openai.api_key = env.get("OPEN_AI_KEY")


def gpt_4_resp(input_text, pre_fix="", post_fix=""):
    try:
        response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content":pre_fix+input_text+post_fix}],
                temperature=0.5,
                max_tokens=4000
            )
        print(response)
        return response.get("choices")[0].get("message").get("content")
    except Exception as e:
        print(e)
        print("Chat gpt4 not available...")
        print("Trying gpt3")
        gpt_3_resp(input_text, pre_fix, post_fix)



models = ["text-davinci-003", "text-curie-001", "text-babbage-001", "text-ada-001"]

def gpt_3_resp(input_text, pre_fix="", post_fix="", model_index=0):

    try:
        response = openai.Completion.create(
                model=models[model_index],
                prompt=pre_fix+input_text+post_fix,
                temperature=0.5,
                max_tokens=4000
            )
        return response.get("choices")[0].get("text")
    except Exception as e:
        print(e)
        if model_index+1 < len(models):
            print("Model not available, trying " + models[model_index+1] + " text model")
            return gpt_3_resp(input_text, pre_fix, post_fix, model_index + 1)
        else:
            raise Exception("No OpenAI GPT Models are functioning. Please check API details")

    