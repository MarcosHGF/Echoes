from flask import request, jsonify, Blueprint
from sqlalchemy import select
from werkzeug.security import check_password_hash
from app.DBClasses import Likes, Users, UserProfile, Post, db

likes_bp = Blueprint("likes", __name__)  
users_bp = Blueprint("users", __name__)  
login_bp = Blueprint("login", __name__)  
profile_bp = Blueprint("profile", __name__)  
posts_bp = Blueprint("posts", __name__)

@likes_bp.route("/api/likes/<post_id>", methods=["GET", "POST"])
def handle_likes(post_id):
    if request.method == 'GET':
        likedata = Likes.getLikeData(postID=post_id)
        return jsonify({"likes_data": likedata})

    elif request.method == 'POST':
        dbdata = request.get_json()
        return jsonify(Likes.addLike(data=dbdata, postID=post_id))

@users_bp.route("/api/users/<user_id>", methods=["GET", "POST"])
def get_users(user_id):
    if request.method == 'GET':
        users = Users.getUserData(userID=user_id)
        return jsonify({"user_data": users})
    
    elif request.method == 'POST':
        Users.addUser(request.get_json())
        return jsonify({"message": "User added"})

@login_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    result = db.session.execute(select(Users).where(Users.username == data["username"])).first()

    if not result:
        return jsonify({"error": "Email ou senha incorretos"}), 401

    user = result[0]  

    if not check_password_hash(user.senha, data["password"]):  
        return jsonify({"error": "Email ou senha incorretos"}), 401

    return jsonify({"message": "Login bem-sucedido", "user_id": user.id})

@profile_bp.route("/api/profile/<username>", methods=["GET", "PATCH"])
def profile(username):
    if request.method == "GET":
        user = db.session.execute(select(Users).where(Users.username == username)).scalar()
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(UserProfile.getUserProfile(user_id=user.id))
    
@posts_bp.route("/api/posts/<postID>",methods=["GET", "POST"])
def posts(postID):
    if request.method == "POST":
       return jsonify(str(Post.addpost(request.get_json())))
    
    else:
        return jsonify(str(Post.getPost(postID))) 