# Welcome to Spaara!

## Get started
To get started, activate the Virtual Environment
For Windows, this is:
``./venv/Scripts/activate`` 

For Linux, IDK what it is :3

## Start the backend
The Virtual Environment should contain everything 
you need to start the project, but if it doesn't,
first cd into the backend directory, then
run ``pip install -r requirements.txt`` 

Then, run ``python manage.py runserver`` and it should run

## Start the frontend

cd into the frontend directory, then follow the 
instructions there

## Include secrets

Create an environment file .env in Spaara/backend 

(mac: 

cd backend

touch .env

)

Inside the .env file specify the following variables with the following values:

"KROGER_CLIENT_ID": Kroger account client id

"KROGER_CLIENT_SECRET": Kroger account client secret key

"GOOGLE_API_KEY": Google mapping API key with Places and Geocoding API services enabled

Mapping WILL NOT FUNCTION without these keys!
