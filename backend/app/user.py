import os
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyPKCE
import spotipy
import redis
from app.utils import generate_state

# Initialize Redis client
redis_client = redis.StrictRedis(host='localhost', port=7777, db=0, decode_responses=True)

class UserAccount:
    def __init__(self):
        load_dotenv()
        self.client_id = os.environ['CLIENT_ID']
        self.redirect_uri = os.environ['REDIRECT_URI']
        self.scope = os.environ['SCOPE']
        self.client_secret = os.environ['CLIENT_SECRET']

        # Initialize SpotifyPKCE
        self.auth_manager = SpotifyPKCE(
            client_id=self.client_id,
            redirect_uri=self.redirect_uri,
            scope=self.scope
        )

    def login(self):
        """
        Generate Spotify authorization URL for user login.
        """
        # Generate a unique state parameter
        state = generate_state()

        # Get the authorization URL (includes code_challenge internally)
        url = self.auth_manager.get_authorize_url(state=state)

        # Store the code_verifier and state in Redis
        redis_client.set(f"state:{state}", self.auth_manager.code_verifier, ex=300)  # Expires in 5 minutes

        print("Code Verifier (Authorization):", self.auth_manager.code_verifier)
        print("State:", state)

        return {"authorization_url": url, "state": state}

    def onLogin(self, auth_code, code_verifier):
        """
        Handle the redirect URL and exchange it for an access token.
        """
        try:
            # Exchange the authorization code for an access token
            token_info = self.auth_manager.get_access_token(code=auth_code, code_verifier=code_verifier)

            # Initialize the Spotipy client with the access token
            self.sp = spotipy.Spotify(auth=token_info['access_token'], auth_manager=self.auth_manager)

            return token_info

        except Exception as e:
            print("Error during token exchange:", e)
            return None
        
    def get_spotify_client(self, user_id):
        """
        Get a Spotipy client with a valid access token.
        """
        # Retrieve a valid access token
        access_token = self.auth_manager.get_access_token(user_id)

        # Initialize Spotipy with the access token
        return spotipy.Spotify(auth=access_token)