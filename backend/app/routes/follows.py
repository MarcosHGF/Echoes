# Follow Route

from flask import Blueprint, jsonify, request
from sqlalchemy import select
from app.DBClasses import Relationship, User, UserProfile, db
from app.utils import jwt_required


add_follower_bp = Blueprint("add_follower_bp", __name__)
get_following_bp = Blueprint("get_followin_bp", __name__)
get_follower_bp = Blueprint("get_follower_bp", __name__)

@add_follower_bp.route("/api/follow", methods=["POST"])
@jwt_required
def follow_user():
    data = request.get_json()
    profile_user_id = data.get("profileUserId")
    user_id = request.user_id

    if not profile_user_id:
        return jsonify({"error": "Missing profileUserId"}), 400

    relation = Relationship(follower_id=user_id, following_id=profile_user_id)
    db.session.add(relation)
    db.session.commit()

    return jsonify({"message": "Follower added successfully"})

@get_following_bp.route("/api/getFollowing")
@jwt_required
def get_following():
    user_id = request.user_id

    followers = Relationship.get_relationship_following(user_id=user_id)

    return ([ {
        jsonify(db.session.execute(select(UserProfile).where(UserProfile.user_id == follower.get("followed_id"))).scalar_one())
    } for follower in followers])

@get_following_bp.route("/api/getFollowers")
@jwt_required
def get_followers():
    user_id = request.user_id

    followers = Relationship.get_relationship_followers(user_id=user_id)

    return ([ {
        jsonify(db.session.execute(select(UserProfile).where(UserProfile.user_id == follower.get("follower_id"))).scalar_one())
    } for follower in followers])
