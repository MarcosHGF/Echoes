from flask import Blueprint, Flask, jsonify, request
from sqlalchemy import select
from DBClasses import SpotifyCredential
from app.utils import decrypt_data, encrypt_data, jwt_required
from spotipy import Spotify
from user import UserAccount
from app.DBClasses import db

play_bp = Blueprint("play_bp", __name__)
pause_bp  = Blueprint("pause_bp", __name__)
playback_bp = Blueprint("playback_bp", __name__)

@play_bp.route('/play', methods=['POST'])
@jwt_required
def play():
    user_id = request.user_id
    data = request.json
    uri = data.get('uri')

    if not uri:
        return jsonify({"error": "URI is required"}), 400

    # Fetch user's Spotify credentials
    user_cred = db.session.execute(
        select(SpotifyCredential).where(SpotifyCredential.user_id==user_id)
    ).scalar()

    if not user_cred:
        return jsonify({"error": "User not linked to Spotify"}), 404
    
    spotify_api = UserAccount()

    # Decrypt tokens
    access_token = decrypt_data(user_cred.access_token)
    refresh_token = decrypt_data(user_cred.refresh_token)

    if not access_token or not refresh_token:
        return jsonify({"error": "Invalid credentials"}), 401

    # Check token validity
    if spotify_api.auth_manager.is_token_expired(access_token):
        # Refresh token
        new_token_info = spotify_api.refresh_access_token(refresh_token)
        if not new_token_info:
            return jsonify({"error": "Failed to refresh token"}), 401
        
        # Update credentials in database
        user_cred.access_token = encrypt_data(new_token_info['access_token'])
        if 'refresh_token' in new_token_info:  # Optional: Update refresh token if provided
            user_cred.refresh_token = encrypt_data(new_token_info['refresh_token'])
        db.session.commit()

        access_token = new_token_info['access_token']

    # Initialize Spotify client with valid token
    spotify_api.sp.set_auth(access_token)

    # Start playback
    try:
        spotify_api.start_playback(uris=[uri])
        return jsonify({'status': 'playing'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pause_bp.route('/pause', methods=['POST'])
@jwt_required
def pause():
    user_id = request.user_id

    # Fetch user's Spotify credentials
    user_cred = db.session.execute(
        select(SpotifyCredential).where(SpotifyCredential.user_id==user_id)
    ).scalar()

    if not user_cred:
        return jsonify({"error": "User not linked to Spotify"}), 404
    
    spotify_api = UserAccount()

    # Decrypt tokens
    access_token = decrypt_data(user_cred.access_token)
    refresh_token = decrypt_data(user_cred.refresh_token)

    if not access_token or not refresh_token:
        return jsonify({"error": "Invalid credentials"}), 401

    # Check token validity
    if spotify_api.auth_manager.is_token_expired(access_token):
        # Refresh token
        new_token_info = spotify_api.refresh_access_token(refresh_token)
        if not new_token_info:
            return jsonify({"error": "Failed to refresh token"}), 401
        
        # Update credentials in database
        user_cred.access_token = encrypt_data(new_token_info['access_token'])
        if 'refresh_token' in new_token_info:
            user_cred.refresh_token = encrypt_data(new_token_info['refresh_token'])
        db.session.commit()

        access_token = new_token_info['access_token']

    # Initialize Spotify client with valid token
    spotify_api.sp.set_auth(access_token)

    # Pause playback
    try:
        spotify_api.sp.pause_playback()
        return jsonify({'status': 'paused'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@playback_bp.route('/current-playback', methods=['GET'])
@jwt_required
def current_playback():
    user_id = request.user_id

    # Fetch user's Spotify credentials
    user_cred = db.session.execute(
        select(SpotifyCredential).where(SpotifyCredential.user_id==user_id)
    ).scalar()

    if not user_cred:
        return jsonify({"error": "User not linked to Spotify"}), 404
    
    spotify_api = UserAccount()

    access_token = decrypt_data(user_cred.access_token)
    refresh_token = decrypt_data(user_cred.refresh_token)

    if not access_token or not refresh_token:
        return jsonify({"error": "Invalid credentials"}), 401

    # Check token validity
    if spotify_api.auth_manager.is_token_expired(access_token):
        # Refresh token
        new_token_info = spotify_api.refresh_access_token(refresh_token)
        if not new_token_info:
            return jsonify({"error": "Failed to refresh token"}), 401
        
        # Update credentials in database
        user_cred.access_token = encrypt_data(new_token_info['access_token'])
        if 'refresh_token' in new_token_info:
            user_cred.refresh_token = encrypt_data(new_token_info['refresh_token'])
        db.session.commit()

        access_token = new_token_info['access_token']

    # Initialize Spotify client with valid token
    spotify_api.sp.set_auth(access_token)

    # Get playback state
    try:
        playback = spotify_api.sp.current_playback()
        if playback:
            return jsonify({
                'is_playing': playback.get('is_playing', False),
                'progress_ms': playback.get('progress_ms'),
                'duration_ms': playback['item']['duration_ms'] if playback.get('item') else None
            })
        return jsonify({'is_playing': False})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
