
from flask import Blueprint, jsonify, request
from app.DBClasses import Track
from app.utils import jwt_required

tracks_bp = Blueprint("tracks", __name__)

@tracks_bp.route("/api/track/<track_uri>", methods=["GET", "POST"])
@jwt_required
def handle_tracks(track_uri):
    if request.method == "POST":
        data = request.get_json()
        result = Track.add_track(data)
        return jsonify(result)
    
    track_data = Track.get_track(track_uri=track_uri)
    if "error" in track_data:
        return jsonify(track_data), 404
    return jsonify(track_data)
