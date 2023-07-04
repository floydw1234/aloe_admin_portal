import json
from boto3 import Session
from botocore.exceptions import BotoCoreError, ClientError
from contextlib import closing


def get_polly_audio(input_text, audio_path, gender="female", engine="standard"):#can also set engine to "neural" for a more natural voice
    session = Session()
    polly = session.client("polly")

    req_type = audio_path.split(".")[1]

    if gender == "female":
        voiceId = "Joanna"
    else:
        voiceId = "Matthew"

    try:
        # Request speech synthesis
        if req_type == "json":
            response = polly.synthesize_speech(Text=input_text, OutputFormat=req_type, VoiceId=voiceId, SpeechMarkTypes=["word"], Engine=engine)
        else:
            response = polly.synthesize_speech(Text=input_text, OutputFormat=req_type, VoiceId=voiceId, Engine=engine)

    except (BotoCoreError, ClientError) as error:
        # The service returned an error, exit gracefully
        print(error)

    # Access the audio stream from the response
    if "AudioStream" in response:
        with closing(response["AudioStream"]) as stream:
            try:
                if req_type == "json":
                    json_data = stream.read().decode()
                    output = {}
                    output["segments"] = [json.loads(segment) for segment in json_data.split("\n") if segment]
                    return output
                else:
                    # Open a file for writing the output as a binary stream
                    with open(audio_path, "wb") as file:
                        file.write(stream.read())
                    return audio_path
            except IOError as error:
                # Could not write to file, exit gracefully
                print(error)
    else:
        # The response didn't contain audio data, exit gracefully
        print("Could not stream audio")