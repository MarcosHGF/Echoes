from flask import request, jsonify, Blueprint
from sqlalchemy import select
from werkzeug.security import check_password_hash
from app.DBClasses import Like, User, UserProfile, Post, db

likes_bp = Blueprint("likes", __name__)  
users_bp = Blueprint("users", __name__)  
login_bp = Blueprint("login", __name__)  
profile_bp = Blueprint("profile", __name__)  
posts_bp = Blueprint("posts", __name__)

@likes_bp.route("/api/likes/<postID>", methods=["GET", "POST"])
def handle_likes(postID):
    if request.method == 'GET':
        likedata = Like.get_like_data(post_id=postID)
        return jsonify({"likes_data": likedata})

    elif request.method == 'POST':
        dbdata = request.get_json()
        return jsonify(Like.add_like(data=dbdata, post_id=postID))

@users_bp.route("/api/users/<user_id>", methods=["GET", "POST"])
def get_users(user_id):
    if request.method == 'GET':
        users = User.get_user_data(user_id=user_id)
        return jsonify({"user_data": users})
    
    elif request.method == 'POST':
        User.add_user(request.get_json())
        return jsonify({"message": "User added"})

@login_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = db.session.execute(select(User).where(User.username == data["username"])).scalar_one()

    if not user:
        return jsonify({"error": "Email ou senha incorretos"}), 401
    

    if not check_password_hash(user.password, data["password"]):  
        return jsonify({"error": "Email ou senha incorretos"}), 401

    return jsonify({"message": "Login bem-sucedido", "user_id": user.id})

@profile_bp.route("/api/profile/<username>", methods=["GET", "PATCH"])
def profile(username):
    if request.method == "GET":
        user = db.session.execute(select(User).where(User.username == username)).scalar()
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(UserProfile.get_user_profile(user_id=user.id))
    
@posts_bp.route("/api/posts/<postID>",methods=["GET", "POST"])
def posts(postID):
    if request.method == "POST":
       return jsonify(str(Post.add_post(request.get_json())))
    
    else:
        return jsonify(str(Post.get_post(postID))) 