# flask_jquery_auth0_boilerplate

put a .env file in your repo that has the following keys to make things work

AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_DOMAIN=
APP_SECRET_KEY=
OPEN_AI_KEY=
WEBSITE_URL=
AWS_ECR_REPO_URL=
S3_BUCKET_NAME=


you will also need to have aws cli logged in as this will need to refference your aws credentials
if you are not using one or more of these services, just exclude the code relating to it and you should be fine
