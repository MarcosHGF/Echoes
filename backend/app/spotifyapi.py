import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials, SpotifyPKCE
import os
from dotenv import load_dotenv

class SpotifyAPI:
    sp: spotipy.Spotify
    def __init__(self):
        load_dotenv()
        
        client = os.environ['CLIENT_ID']
        secret = os.environ['CLIENT_SECRET']
        uri = os.environ['REDIRECT_URI']
        scope = os.environ['SCOPE']

        self.sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=client,
            client_secret=secret,
            redirect_uri=uri,
            scope=scope    
        ))

       

        self.sp
        user = self.sp.me()

        print(user)
        
        auth_manager = SpotifyClientCredentials(client_id=client, client_secret=secret)  
        spauth = spotipy.Spotify(auth_manager=auth_manager)

        playlists = spauth.user_playlists(user['id'])
        while playlists:
            for i, playlist in enumerate(playlists['items']):
                print("%4d %s %s" % (i + 1 + playlists['offset'], playlist['uri'],  playlist['name']))
            if playlists['next']:
                playlists = spauth.next(playlists)
            else:
                playlists = None

        
        

    def search_track(self, query, limit):
        results = self.sp.search(q=query, type='track', limit=limit)
        return results

    def search_album(self, query, limit):
        results = self.sp.search(q=query, type='album', limit=limit)
        return results['albums']['items']
    
    def search_artist(self, query, limit=10):
        results = self.sp.search(q=query, type='artist', limit=limit)
        return results['artists']['items']['']
    
    def create_playlist(self, user_id, name, description='', public=True):
        playlist = self.sp.user_playlist_create(user=user_id, name=name, public=public, description=description)
        return playlist
    
    def delete_playlist(self, playlist_id):
        self.sp.playlist_unfollow(playlist_id)
        return {"message": "Playlist deleted successfully"}
    
    def add_tracks_to_playlist(self, playlist_id, track_uris):
        self.sp.playlist_add_items(playlist_id, track_uris)
        return {"message": "Tracks added successfully"}
        
    def remove_tracks_from_playlist(self, playlist_id, track_uris): 
        self.sp.playlist_remove_all_occurrences_of_items(playlist_id, track_uris)
        return {"message": "Tracks removed successfully"}
    
    def play_song(self, song_uri):
        self.sp.start_playback(uris=[song_uri])

    def pause(self):
        self.sp.pause_playback()

