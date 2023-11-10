import json
from sys import argv
from datetime import datetime
from os import environ as env
from dotenv import find_dotenv, load_dotenv
from urllib.parse import quote_plus, urlencode
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import requests
from bson.json_util import dumps, loads
from authlib.integrations.flask_client import OAuth
from flask import Flask, redirect, render_template, session, url_for, jsonify, request
import random
from utils import get_args_dict

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

conn_string = f"mongodb+srv://{env.get('MONGO_USERNAME')}:{env.get('MONGO_PASSWORD')}@test.jzgvx1f.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(conn_string, server_api=ServerApi('1'))

db = client.get_database("Aloe_mvp")
leads_coll = db.get_collection("leads")
library_coll = db.get_collection("library")
user_coll = db.get_collection("Users")
demo_coll = db.get_collection("demos")
question_coll = db.get_collection("demo_questions")
client_col = db.get_collection("clients")
app = Flask(__name__)
app.secret_key = env.get("APP_SECRET_KEY")

args = {}

oauth = OAuth(app)

oauth.register(
    "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)

@app.route("/")
def main_page():
    
    email = (session.get("user", {}).get("userinfo", {}).get("email"))
    if email:
        user = user_coll.find_one({"email":email})
        if user:
            client_id = user.get("client_id")
            return render_template("index.html", client_id= client_id,client_name=client_col.find_one({"_id":client_id }).get("name"),session=session, pretty=json.dumps(session.get('user'), indent=4))

    return render_template("403.html")


@app.route("/get_leads", methods=['GET'])
def get_leads():
    email = (session.get("user", {}).get("userinfo", {}).get("email"))
    print(email)
    if email:
        user = user_coll.find_one({"email":email})
        print(user)
        if user:
            output = []
            cursor = leads_coll.find({"client_id":user.get("client_id")})
            for doc in cursor:
                del doc["_id"]
                output.append(doc)
            print(output)
            return jsonify(output)
    return jsonify({"status":"not authorized"}), 403

@app.route("/get_library/<client_id>", methods=['GET'])
def get_library(client_id):
    output = []
    cursor = library_coll.find({"client_id": int(client_id)})
    for doc in cursor:
        del doc["_id"]
        output.append(doc)
    return jsonify(output)


@app.route("/get_demos/<client_id>", methods=['GET'])
def get_demos(client_id):
    output = []
    cursor = demo_coll.find({"client_id": int(client_id)})
    for doc in cursor:
        output.append(doc)
    
    return dumps(output)

@app.route("/update_demo", methods=['POST'])
def update_demos():
    new_item = loads(json.dumps(request.get_json()))

    email = (session.get("user", {}).get("userinfo", {}).get("email"))
    if email:
        user = user_coll.find_one({"email":email})
        print(new_item)
        new_item["client_id"] = user.get("client_id")
        if new_item.get("_id"):
            demo_coll.replace_one({"_id": new_item.get("_id")}, new_item)
        else:
            new_item["_id"] = str(random.getrandbits(32))
            demo_coll.insert_one(new_item)
        return jsonify({"status":"ok"})
    else:
        return jsonify({"status":"error 403"})

@app.route("/delete_demo", methods=['POST'])
def delete_demos():
    item = loads(json.dumps(request.get_json()))
    demo_coll.delete_one({"_id": item.get("_id")})
    return jsonify({"status":"ok"})

@app.route("/insert_library_item", methods=['POST'])
def post_library():
    email = (session.get("user").get("userinfo").get("email"))
    item = request.get_json()
    item["updated_by"] = session["user"]["userinfo"]["email"]
    item["updated"] = datetime.now()
    item["created"] = datetime.now()
    item["client_id"] = user_coll.find_one({"email":email}).get("client_id")
    
    library_coll.insert_one(item)
    return jsonify({"status": "ok"})

@app.route("/extract_form_data/<client_id>", methods=["GET"])
def extract_info(client_id):
    
    resp = requests.get("http://localhost:10000/extract_form_data/"+str(client_id))
    return jsonify(resp.json())

@app.route("/login")
def login():
    redirect_uri = url_for("callback", _external=True) if app.debug else f"https://{ env.get('WEBSITE_URL') }/callback"
    return oauth.auth0.authorize_redirect(
        redirect_uri=redirect_uri
    )

@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    return redirect("/")

@app.route("/logout")
def logout():
    if app.debug:
        return_page = url_for("main_page", _external=True)
    else:
        return_page = f"https://{ env.get('WEBSITE_URL') }/"
    session.clear()
    return redirect(
        "https://" + env.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": return_page,
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )

@app.route("/health")
def health():
    return jsonify({"status":"ok"})

if __name__ == "__main__":
    args = get_args_dict(argv)
    if args.get("--prod", 'n').lower() == 'y':
        app.run(host="0.0.0.0",port=10000, debug=False)
    else:
        app.run(host="0.0.0.0",port=5000, debug=True, ssl_context=("cert.pem", "key.pem"))

