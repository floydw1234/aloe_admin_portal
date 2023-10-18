from pymongo.mongo_client import MongoClient
from os import environ as env
from pymongo.server_api import ServerApi

MONGO_PASSWORD="2ZsSfmvq3R6e1rB7"
MONGO_USERNAME="floydw1234"
conn_string = f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@test.jzgvx1f.mongodb.net/?retryWrites=true&w=majority"

print(conn_string)

client = MongoClient(conn_string, server_api=ServerApi('1'))

db = client.get_database("Aloe_mvp")
leads_coll = db.get_collection("leads")
library_coll = db.get_collection("library")
user_coll = db.get_collection("Users")
demo_coll = db.get_collection("demos")
question_coll = db.get_collection("demo_questions")
client_col = db.get_collection("clients")


def transfer_stuff():
    all_demos = demo_coll.find({})
    for demo in all_demos:
        questions = demo.get("questions", [])
        for i in range(len(questions)):
            q = questions[i]
            print(q)
            if type(q) == int:
                string_question =question_coll.find_one({"_id":q})
                demo["questions"][i] = string_question
        demo_coll.replace_one({"_id":demo["_id"]}, demo)

transfer_stuff()