from app import create_app, db
from app.spotifyapi import SpotifyAPI
from flask_cors import CORS

app = create_app()
CORS(app)


# Inicializa o banco de dados
with app.app_context():
    db.create_all() 

if __name__ == "__main__":
    app.run(debug=True)

user = SpotifyAPI()
play = user.search_track("illmatic", limit=1)
user.play_song('spotify:track:7G3lxTsMfSx4yarMkfgnTC')

