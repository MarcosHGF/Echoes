from flask import Flask, jsonify, request
from spotifyapi import SpotifyAPI  # Your provided SpotifyAPI class

app = Flask(__name__)
spotify_api = SpotifyAPI()

@app.route('/play', methods=['POST'])
def play():
    data = request.json
    uri = data.get('uri')
    spotify_api.play_song(uri)
    return jsonify({'status': 'playing'})

@app.route('/pause', methods=['POST'])
def pause():
    spotify_api.pause()
    return jsonify({'status': 'paused'})

@app.route('/current-playback', methods=['GET'])
def current_playback():
    playback = spotify_api.sp.current_playback()
    if playback:
        return jsonify({
            'is_playing': playback['is_playing'],
            'progress_ms': playback['progress_ms'],
            'duration_ms': playback['item']['duration_ms']
        })
    return jsonify({'is_playing': False})

if __name__ == '__main__':
    app.run(port=5000)