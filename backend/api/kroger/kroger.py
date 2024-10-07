import requests as req
import json
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
from requests.auth import HTTPBasicAuth


client_id = "spaara-243261243034247667504c4775576c74642e56726f2e556d744563784f565a38625a7a5a5336335a6e6d475978374b686d464f39344b6c5a6a4374324459061933678969631"
client_secret = ""
krogerUrl = 'https://api-ce.kroger.com/v1'
krogerAuthUrl = 'https://api-ce.kroger.com/v1/connect/oauth2'

auth = HTTPBasicAuth(client_id, client_secret)
client = BackendApplicationClient(client_id=client_id, scope='product.compact')
oauth = OAuth2Session(client=client)
token = oauth.fetch_token(token_url=f'{krogerAuthUrl}/token', auth=auth)


print(token['access_token'])

payload = {"filter.term": "milk" , "filter.limit" : "2"}




res = req.get(f'{krogerUrl}/products', headers= { "Authorization": f"{token['token_type']} {token['access_token']}"}, params=payload)
print(res.json())