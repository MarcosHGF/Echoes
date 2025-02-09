from flask import request, jsonify, Blueprint
from app.DBClasses import Likes, db

routes_bp = Blueprint("routes", __name__)  # Create a Blueprint

@routes_bp.route("/api/likes/<int:postID>", methods=["GET", "POST"])
def handle_likes(postID):
    if request.method == 'GET':
        likedata = Likes.getLikeData(postID=postID)
        return jsonify({
            "likes_data": str(likedata)
        })

    elif request.method == 'POST':
        Likes.addLike(request.get_json()) 
        return jsonify({"message": f"Like added to post {postID}"})


