import requests as req

from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
from requests.auth import HTTPBasicAuth




class krogerApi:
    client_id = "spaara-243261243034247667504c4775576c74642e56726f2e556d744563784f565a38625a7a5a5336335a6e6d475978374b686d464f39344b6c5a6a4374324459061933678969631"
    client_secret = "x8dLBhfDUjHCqwS1Q9p9JZBNAA9pYrlB5JdEq5FE"
    krogerUrl = 'https://api-ce.kroger.com/v1'
    krogerAuthUrl = 'https://api-ce.kroger.com/v1/connect/oauth2'

    def __init__(self) -> None:
        self.token = krogerApi.getToken()
        
    
    def getToken(): 
        auth = HTTPBasicAuth(krogerApi.client_id, krogerApi.client_secret)
        client = BackendApplicationClient(client_id=krogerApi.client_id, scope='product.compact')
        oauth = OAuth2Session(client=client)
        return oauth.fetch_token(token_url=f'{krogerApi.krogerAuthUrl}/token', auth=auth)
    
    def getItem(self, item):
        result = req.get(f'{krogerApi.krogerUrl}/products', headers={'Authorization': f"{self.token['token_type']} {self.token['access_token']}"}, params={"filter.term": item, "filter.fulfillment": "csp"})
        return result.json()

    def findCheapest(self, lists):
        price = 999999999
        for data in lists['data']:
            if data["items"][0]["price"] < price:
                price = data["items"][0]["price"]




