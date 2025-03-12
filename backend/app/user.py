import os
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyPKCE, SpotifyClientCredentials
import spotipy
import redis
from app.utils import generate_state
from app.DBClasses import User

# Initialize Redis client
redis_client = redis.StrictRedis(host='localhost', port=7777, db=0, decode_responses=False)

class UserAccount:
    def __init__(self):
        load_dotenv()
        self.client_id = os.getenv("CLIENT_ID")
        self.redirect_uri = os.getenv("REDIRECT_URI")
        self.scope = os.getenv("SCOPE")
        self.client_secret = os.getenv("CLIENT_SECRET")

        # Initialize SpotifyPKCE
        self.auth_manager = SpotifyPKCE(
            client_id=self.client_id,
            redirect_uri=self.redirect_uri,
            scope=self.scope
        )

        self.credentials = SpotifyClientCredentials(
            client_id=self.client_id,
            client_secret=self.client_secret
        )

        self.sp = spotipy.Spotify(
            client_credentials_manager=self.credentials,
            auth_manager=self.auth_manager
        )



    def login(self):
        """
        Generate Spotify authorization URL for user login and store state in Redis.
        """
        state = generate_state()
        
        # Store state temporarily in Redis (5-minute expiration)
        redis_client.setex(f"spotify_state:{state}", 300, "active")

        url = self.auth_manager.get_authorize_url(state=state)
        return {"authorization_url": url, "state": state}

    def on_login(self, auth_code, state):
        """
        Handle the redirect URL, validate state, and exchange the auth code for an access token.
        """

        # Verify state exists in Redis
        if not redis_client.get(f"spotify_state:{state}"):
            return {"error": "Invalid or expired state"}, 400

        try:
            # Exchange auth code for access token
            token_info = self.auth_manager.get_access_token(code=auth_code, check_cache=False)

            if not token_info:
                return {"error": "Failed to retrieve access token"}, 400

            # Initialize Spotipy client
            self.sp = spotipy.Spotify(auth=token_info, client_credentials_manager=self.credentials, auth_manager=self.auth_manager)
            self.add_user()
            
            return token_info

        except Exception as e:
            print(f"Object Error during token exchange: {e}")
            return {"error": "Token exchange failed"}, 500

    def add_user(self):
        user = self.sp.current_user()
        email = user['email']
        username = user['display_name']
        id = user['id']

        token = self.auth_manager.cache_handler.get_cached_token()

        User.add_user_spotify(
            email=email,
            username=username,
            spotify_id=id,
            access_token=token['access_token'],
            refresh_token=token['refresh_token'],
            token_expiry=token['expires_at']
            )

        return

    def refresh_access_token(self, state):
        """
        Refresh the Spotify access token using the stored refresh token.
        """
        refresh_token = redis_client.get(f"spotify_refresh:{state}")
        if not refresh_token:
            return {"error": "No refresh token found"}, 401

        try:
            new_token_info = self.auth_manager.refresh_access_token(refresh_token)
            redis_client.setex(f"spotify_access:{state}", 3600, new_token_info["access_token"])

            return new_token_info

        except Exception as e:
            print(f"Error refreshing access token: {e}")
            return {"error": "Failed to refresh access token"}, 500

    def get_spotify_client(self, state):
        """
        Get a Spotipy client with a valid access token.
        """
        access_token = redis_client.get(f"spotify_access:{state}")

        if not access_token:
            # Attempt to refresh token
            new_token_info = self.refresh_access_token(state)
            if "error" in new_token_info:
                return None  # Return None if refresh fails

            access_token = new_token_info["access_token"]

        return spotipy.Spotify(auth=access_token)
