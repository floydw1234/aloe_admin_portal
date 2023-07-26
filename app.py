import json
from sys import argv
from datetime import datetime
from os import environ as env
from dotenv import find_dotenv, load_dotenv
from urllib.parse import quote_plus, urlencode
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import boto3
from authlib.integrations.flask_client import OAuth
from flask import Flask, redirect, render_template, session, url_for, jsonify, request

from utils import get_args_dict

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

conn_string = f"mongodb+srv://{env.get('MONGO_USERNAME')}:{env.get('MONGO_PASSWORD')}@test.jzgvx1f.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(conn_string, server_api=ServerApi('1'))

db = client.get_database("Aloe_mvp")
leads_coll = db.get_collection("leads")
library_coll = db.get_collection("library")

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
    return render_template("index.html", session=session, pretty=json.dumps(session.get('user'), indent=4))


@app.route("/get_leads", methods=['GET'])
def get_leads():
    output = []
    cursor = leads_coll.find({})
    for doc in cursor:
        del doc["_id"]
        output.append(doc)
    return jsonify(output)

@app.route("/get_library", methods=['GET'])
def get_library():
    output = []
    cursor = library_coll.find({})
    for doc in cursor:
        del doc["_id"]
        output.append(doc)
    return jsonify(output)

@app.route("/insert_library_item", methods=['POST'])
def post_library():
    item = request.get_json()
    item["updated_by"] = session["user"]["userinfo"]["email"]
    item["updated"] = datetime.now()
    item["created"] = datetime.now()
    item["client_id"] = 1
    item["demo_id"] = 1
    
    library_coll.insert_one(item)
    return jsonify({"status": "ok"})

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
        app.run(host="0.0.0.0",port=80, debug=False)
    else:
        app.run(host="0.0.0.0",port=5000, debug=True, ssl_context=("cert.pem", "key.pem"))

