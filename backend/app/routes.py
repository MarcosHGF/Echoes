from flask import request, jsonify, Blueprint
from sqlalchemy import select
from werkzeug.security import check_password_hash
from app.DBClasses import Likes, Users, db

likes_bp = Blueprint("likes", __name__)  # Create a Blueprint
users_bp = Blueprint("users", __name__)  # Create a Blueprint
login_bp = Blueprint("login", __name__)  # Create Login Blueprint
profile_bp = Blueprint("profile", __name__) #get user profile 

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

@login_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    result = db.session.execute(select(Users).where(Users.email == data["email"])).first()

    if not result:
        return jsonify({"error": "Email ou senha incorretos"}), 401

    user = result[0]  # Extract the Users object from the tuple

    if not check_password_hash(user.senha, data["senha"]):  
        return jsonify({"error": "Email ou senha incorretos"}), 401

    return jsonify({"message": "Login bem-sucedido", "user_id": user.id})

@profile_bp.route("/api/profile/<username>", methods=["GET", "PATCH"])
def profile:
