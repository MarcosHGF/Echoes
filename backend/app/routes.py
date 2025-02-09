from flask import request, jsonify, Blueprint
from app.DBClasses import Likes, Users, db

likes_bp = Blueprint("likes", __name__)  # Create a Blueprint
users_bp = Blueprint("users", __name__)  # Create a Blueprint

@likes_bp.route("/api/likes/<int:postID>", methods=["GET", "POST"])
def handle_likes(postID):
    if request.method == 'GET':
        likedata = Likes.getLikeData(postID=postID)
        return jsonify({
            "likes_data": str(likedata)
        })

    elif request.method == 'POST':
        Likes.addLike(request.get_json()) 
        return jsonify({"message": f"Like added to post {postID}"})

@users_bp.route("/api/users/<int:user_id>", methods=["GET", "POST"])
def get_users(user_id):
    if request.method == 'GET':
        users = Users.getUserData(userID=user_id)
        return jsonify({
            "user_data": str(users)
        })
    
    elif request.method == 'POST':
        Users.addUser(request.get_json())
        return jsonify({"message": f"user added"})
