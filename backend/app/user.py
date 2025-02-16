from app.extensions import db
import spotipy 
from app.spotifyapi import SpotifyAPI

def spotifyLoginHandler():
    spotify = SpotifyAPI()