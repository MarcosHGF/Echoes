import spotipy
from spotipy.oauth2 import SpotifyOAuth

class SpotifyAPI:
    def __init__(self, client_id, client_secret, redirect_uri, scope):
        self.sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope=scope
        ))

    def search_track(self, query, limit=10):
        results = self.sp.search(q=query, type='track', limit=limit)
        return results['tracks']['items']

    def search_album(self, query, limit=10):
        results = self.sp.search(q=query, type='album', limit=limit)
        return results['albums']['items']

    def search_artist(self, query, limit=10):
        results = self.sp.search(q=query, type='artist', limit=limit)
        return results['artists']['items']

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
