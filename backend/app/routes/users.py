from flask import Blueprint, jsonify, request
from sqlalchemy import select
from app.utils import jwt_required
from app.DBClasses import User, UserProfile, db


users_bp = Blueprint("users", __name__)
profile_bp = Blueprint("profile", __name__)

# Users Route
@users_bp.route("/api/users/<user_id>", methods=["GET", "POST"])
def handle_users(user_id):
    if request.method == 'GET':
        user_data = User.get_user_data(user_id=user_id)
        if "error" in user_data:
            return jsonify(user_data), 404
        return jsonify({"user_data": user_data})

    elif request.method == 'POST':
        data = request.get_json()
        result = User.add_user(data)
        return jsonify(result)



# Profile Route
@profile_bp.route("/api/profile/<username>", methods=["GET", "PATCH"])
@jwt_required
def handle_profile(username):
    user = None
    if username != "me":
        user = db.session.execute(select(User).where(User.username == username)).scalar()
        if not user:
            return jsonify({"error": f"User not found {username}"}), 404

    

    if request.method == "GET":
        profile_data = UserProfile.get_user_profile(user_id=user.id if user else request.user_id)
        print(profile_data)
        return jsonify(profile_data)

    elif request.method == "PATCH":
        data = request.get_json()
        profile = db.session.execute(select(UserProfile).where(UserProfile.user_id == user.id)).scalar()

        if not profile:
            return jsonify({"error": "Profile not found"}), 404

        # Update profile fields
        if "musics" in data:
            profile.musics = data["musics"]
        if "pfp" in data:
            profile.pfp = data["pfp"]

        db.session.commit()
        return jsonify({"message": "Profile updated successfully"})