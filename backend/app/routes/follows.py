# Follow Route

from flask import Blueprint, jsonify, request
from app.DBClasses import Relationship, db
from app.utils import jwt_required


add_follower_bp = Blueprint("add_follower_bp", __name__)

@add_follower_bp.route("/api/follow/<user_id>", methods=["POST"])
@jwt_required
def follow_user(user_id):
    data = request.get_json()
    profile_user_id = data.get("profileUserId")

    if not profile_user_id:
        return jsonify({"error": "Missing profileUserId"}), 400

    relation = Relationship(follower_id=user_id, following_id=profile_user_id)
    db.session.add(relation)
    db.session.commit()

    return jsonify({"message": "Follower added successfully"})

