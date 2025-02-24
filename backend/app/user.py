import os
from dotenv import load_dotenv
import spotipy

class UserAccount:
    def __init__(self):  
        load_dotenv()
        
        client = os.environ['CLIENT_ID']
        secret = os.environ['CLIENT_SECRET']
        uri = os.environ['REDIRECT_URI']
        scope = os.environ['SCOPE']
        self.sp = spotipy.SpotifyPKCE(
            client_id=client,
            redirect_uri=uri,
            scope=scope    
        )

    def login(self) -> str:
        url = self.sp.get_authorize_url()
        return url 
        

