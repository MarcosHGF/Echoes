from flask import request, jsonify, Blueprint
from app.DBClasses import Likes, Users, db

likes_bp = Blueprint("likes", __name__)  # Create a Blueprint
users_bp = Blueprint("users", __name__)  # Create a Blueprint

@likes_bp.route("/api/likes/<post_id>", methods=["GET", "POST"])
def handle_likes(post_id):
    if request.method == 'GET':
        likedata = Likes.getLikeData(postID=post_id)
        return jsonify({
            "likes_data": str(likedata)
        })

    elif request.method == 'POST':
        dbdata = request.get_json()
        Likes.addLike(data=dbdata, postID=post_id) 
        return jsonify({"message": f"Like added to post {post_id}"})

@users_bp.route("/api/users/<user_id>", methods=["GET", "POST"])
def get_users(user_id):
    if request.method == 'GET':
        users = Users.getUserData(userID=user_id)
        return jsonify({
            "user_data": str(users)
        })
    
    elif request.method == 'POST':
        Users.addUser(request.get_json())
        return jsonify({"message": f"user added"})
