from flask import Blueprint, jsonify, request
from app.utils import jwt_required
from app.DBClasses import Like


likes_bp = Blueprint("likes", __name__)


@likes_bp.route("/api/likes/<post_id>", methods=["GET", "POST"])
@jwt_required
def handle_likes(post_id):
    if request.method == 'GET':
        likes_data = Like.get_like_data(post_id=post_id)
        return jsonify({"likes_data": likes_data})

    elif request.method == 'POST':
        data = request.get_json()
        result = Like.add_like(data=data, post_id=post_id)
        return jsonify(result)