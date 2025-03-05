import os
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyPKCE
import spotipy
import redis

# Initialize Redis client
redis_client = redis.StrictRedis(host='localhost', port=7777, db=0, decode_responses=True)

class UserAccount:
    def __init__(self):
        load_dotenv()
        self.client_id = os.environ['CLIENT_ID']
        self.redirect_uri = os.environ['REDIRECT_URI']
        self.scope = os.environ['SCOPE']

        # Initialize SpotifyPKCE
        self.sp = SpotifyPKCE(
            client_id=self.client_id,
            redirect_uri=self.redirect_uri,
            scope=self.scope
        )

    def login(self):
        """
        Generate Spotify authorization URL for user login.
        """
        # Get the authorization URL (includes code_challenge internally)
        url = self.sp.get_authorize_url()

        # Store the code_verifier in Redis
        redis_client.set('code_verifier', self.sp.code_verifier)

        print("Authorization URL:", url)
        print("Code Verifier (Authorization):", self.sp.code_verifier)
        return url

    def onLogin(self, url):
        """
        Handle the redirect URL and exchange it for an access token.
        """
        auth_code = url.get("code")
        print("Received code:", auth_code)

        if not auth_code:
            print("No auth code found!")
            return None

        try:
            # Retrieve the code_verifier from Redis
            code_verifier = redis_client.get('code_verifier')
            if not code_verifier:
                print("Code verifier not found in Redis!")
                return None

            print("Code Verifier (Token Exchange):", code_verifier)

            # Exchange the authorization code for an access token
            token_info = self.sp.get_access_token(code=auth_code, code_verifier=code_verifier)
            print("Token Info:", token_info)
            return token_info
        except Exception as e:
            print("Error during token exchange:", e)
            return None
        
    def get_spotify_client(self, user_id):
        """
        Get a Spotipy client with a valid access token.
        """
        # Retrieve a valid access token
        access_token = self.sp.get_access_token(user_id)

        # Initialize Spotipy with the access token
        return spotipy.Spotify(auth=access_token)