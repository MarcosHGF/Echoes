from flask import request, jsonify, Blueprint
from sqlalchemy import select
from werkzeug.security import check_password_hash
from app.DBClasses import Like, User, UserProfile, Post, Track, Relationship, db
from app.user import UserAccount
from utils import generate_state
from user import redis_client

likes_bp = Blueprint("likes", __name__)
users_bp = Blueprint("users", __name__)
login_bp = Blueprint("login", __name__)
profile_bp = Blueprint("profile", __name__)
posts_bp = Blueprint("posts", __name__)
userposts_bp = Blueprint("userposts", __name__)
spotify_login = Blueprint("spotify_login", __name__)
spotify_auth = Blueprint("spotify_auth", __name__)
tracks_bp = Blueprint("tracks", __name__)
getPostsUser_bp = Blueprint("getPostsUser", __name__)
add_follower_bp = Blueprint("add_follower_bp", __name__)

# Likes Route
@likes_bp.route("/api/likes/<post_id>", methods=["GET", "POST"])
def handle_likes(post_id):
    if request.method == 'GET':
        likes_data = Like.get_like_data(post_id=post_id)
        return jsonify({"likes_data": likes_data})

    elif request.method == 'POST':
        data = request.get_json()
        result = Like.add_like(data=data, post_id=post_id)
        return jsonify(result)

# Users Route
@users_bp.route("/api/users/<user_id>", methods=["GET", "POST"])
def handle_users(user_id):
    if request.method == 'GET':
        user_data = User.get_user_data(user_id=user_id)
        if "error" in user_data:
            return jsonify(user_data), 404
        return jsonify({"user_data": user_data})

    elif request.method == 'POST':
        data = request.get_json()
        result = User.add_user(data)
        return jsonify(result)

# Login Route
@login_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = db.session.execute(select(User).where(User.username == data["username"])).scalar()

    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    if not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({"message": "Login successful", "user_id": user.id})

# Profile Route
@profile_bp.route("/api/profile/<username>", methods=["GET", "PATCH"])
def handle_profile(username):
    user = db.session.execute(select(User).where(User.username == username)).scalar()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if request.method == "GET":
        profile_data = UserProfile.get_user_profile(user_id=user.id)
        return jsonify(profile_data)

    elif request.method == "PATCH":
        data = request.get_json()
        profile = db.session.execute(select(UserProfile).where(UserProfile.user_id == user.id)).scalar()

        if not profile:
            return jsonify({"error": "Profile not found"}), 404

        # Update profile fields
        if "musics" in data:
            profile.musics = data["musics"]
        if "pfp" in data:
            profile.pfp = data["pfp"]

        db.session.commit()
        return jsonify({"message": "Profile updated successfully"})

# Posts Route
@posts_bp.route("/api/posts/<post_id>", methods=["GET", "POST"])
def handle_posts(post_id):
    if request.method == "POST":
        data = request.get_json()
        result = Post.add_post(data)
        return jsonify(result)

    post_data = Post.get_post(post_id=post_id)
    if "error" in post_data:
        return jsonify(post_data), 404
    return jsonify(post_data)

# User Posts Route
@userposts_bp.route("/api/userposts/<user_id>", methods=["GET"])
def get_user_posts(user_id):
    posts = db.session.execute(select(Post).where(Post.user_id == user_id)).scalars().all()
    return jsonify([
        {
            "id": post.id,
            "user": post.name,
            "date": post.date_created.isoformat(),
            "content": post.content,
            "likes": post.likes,
            "tags_id": post.tags_id
        } for post in posts
    ])

# Spotify Login Route
@spotify_login.route("/api/spotifylogin", methods=["GET"])
def spotify_login_route():
    user_account = UserAccount()
    login_data = user_account.login()
    return jsonify(login_data)

# Spotify Auth Route
@spotify_auth.route("/auth", methods=["GET"])
def spotify_auth_route():
    auth_code = request.args.get("code")
    state = request.args.get("state")

    if not auth_code or not state:
        return jsonify({"error": "Authorization code or state parameter missing"}), 400

    try:
        # Retrieve the code_verifier from Redis using the state
        code_verifier = redis_client.get(f"state:{state}")
        if not code_verifier:
            return jsonify({"error": "Invalid or expired state parameter"}), 400

        print("Code Verifier (Token Exchange):", code_verifier.decode())

        # Initialize the UserAccount and exchange the authorization code for tokens
        user_account = UserAccount()
        token_info = user_account.onLogin(auth_code, code_verifier.decode())

        if token_info is None:
            return jsonify({"error": "Authentication failed"}), 400

        # Optionally, store tokens in the database
        # user_id = db.session.execute(select(User).where(...)).scalar()
        # SpotifyCredential.update_credentials(user_id=user_id, ...)

        return jsonify({"message": "Authentication successful", "token_info": token_info})

    except Exception as e:
        print("Error during token exchange:", e)
        return jsonify({"error": str(e)}), 500

# Tracks Route
@tracks_bp.route("/api/track/<track_uri>", methods=["GET", "POST"])
def handle_tracks(track_uri):
    if request.method == "POST":
        data = request.get_json()
        result = Track.add_track(data)
        return jsonify(result)

    track_data = Track.get_track(track_uri=track_uri)
    if "error" in track_data:
        return jsonify(track_data), 404
    return jsonify(track_data)

# Get Posts from Followed Users Route
@getPostsUser_bp.route("/api/getPostsUser/<user_id>", methods=["GET"])
def get_posts_from_followed_users(user_id):
    following = db.session.execute(
        select(Relationship).where(Relationship.follower_id == user_id)
    ).scalars().all()

    posts = []
    if following:
        for relation in following:
            posts.extend(
                db.session.execute(
                    select(Post).where(Post.user_id == relation.following_id)
                ).scalars().all()
            )
    else:
        posts = db.session.execute(select(Post).where(Post.user_id == user_id)).scalars().all()

    return jsonify([
        {
            "id": post.id,
            "user": post.name,
            "date": post.date_created.isoformat(),
            "content": post.content,
            "likes": post.likes,
        } for post in posts
    ])

# Follow Route
@add_follower_bp.route("/api/follow/<user_id>", methods=["POST"])
def follow_user(user_id):
    data = request.get_json()
    profile_user_id = data.get("profileUserId")

    if not profile_user_id:
        return jsonify({"error": "Missing profileUserId"}), 400

    relation = Relationship(follower_id=user_id, following_id=profile_user_id)
    db.session.add(relation)
    db.session.commit()

    return jsonify({"message": "Follower added successfully"})