import json
from sys import argv
from os import environ as env
from dotenv import find_dotenv, load_dotenv
from urllib.parse import quote_plus, urlencode

import boto3
from authlib.integrations.flask_client import OAuth
from flask import Flask, redirect, render_template, session, url_for, jsonify

from utils import get_args_dict

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

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


@app.route("/download_file/<file_id>", methods=['GET'])
def download_movie(file_id):
    try:
        s3 = boto3.client('s3')
        url = s3.generate_presigned_url('get_object', Params = {'Bucket': env.get('S3_BUCKET_NAME'), 'Key': file_id }, ExpiresIn = 360)
        return redirect(url, code=302)
    except:
        return jsonify({"status":"error"}), 404

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
        app.run(host="0.0.0.0",port=5000, debug=True, ssl_context='adhoc')

