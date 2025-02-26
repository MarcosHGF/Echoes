from flask import request, jsonify, Blueprint
from sqlalchemy import select
from werkzeug.security import check_password_hash
from app.DBClasses import Like, User, UserProfile, Post, Track, Relationship, db
from app.user import UserAccount

likes_bp = Blueprint("likes", __name__)
users_bp = Blueprint("users", __name__)  
login_bp = Blueprint("login", __name__)  
profile_bp = Blueprint("profile", __name__)  
posts_bp = Blueprint("posts", __name__)
userposts_bp = Blueprint("userposts", __name__)
spotify_login = Blueprint("spotify_login", __name__)
tracks_bp = Blueprint("tracks", __name__)
getPostsUser_bp = Blueprint("getPostsUser", __name__)
add_follower_bp = Blueprint("add_follower_bp", __name__)

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
        print(str(Post.get_post(postID)))
        return jsonify(str(Post.get_post(postID))) 
    
@userposts_bp.route("/api/userposts/<userID>",methods=["GET"])
def posts(userID):
    posts = db.session.execute(select(Post).where(Post.user_id==userID)).scalars().all()
    return [ {
        "id": post.id,
        "user": post.name,
        "date": post.date_created,
        "content": post.content,
        "likes": post.likes,
        "tags_id": post.tags_id
    } for post in posts ]

    
@spotify_login.route("/api/spotifylogin", methods=["GET"])
def spotifylogin():
    url = UserAccount.login()
    print(url)
    return jsonify(url)

@tracks_bp.route("/api/track/<track_uri>", methods=["GET", "POST"])
def tracks(track_uri):
    if request.method == "POST":
        trackadd = request.get_json()
        return jsonify(Track.addTrack(trackadd))

    track = Track().get_track(track_uri=track_uri)
    return jsonify(track)

@getPostsUser_bp.route("/api/getPostsUser/<userID>", methods=["GET"])
def getPosts(userID):
    following = db.session.execute(select(Relationship).where(Relationship.follower_id==userID)).scalars().all()
    posts = []

    for user in following:
        posts.append(db.session.execute(select(Post).where(Post.user_id==user.following_id)))
    
    return [ {
        "id": post.id,
        "user": post.name,
        "date": post.date_created,
        "content": post.content,
        "likes": post.likes,
        "tags_id": post.tags_id
    } for post in posts ]


@add_follower_bp.route("/api/follow/<userID>", methods=["POST"])
def follow(userID):
    data = request.get_json()


    relation = Relationship(follower_id=userID, following_id=data.get("profileUserId"))
    db.session.add(relation)
    db.session.commit()
    return '"message": "follower added"'