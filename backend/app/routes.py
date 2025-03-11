import pickle
from flask import request, jsonify, Blueprint
import jwt
from sqlalchemy import select
from werkzeug.security import check_password_hash
from app.DBClasses import Like, User, UserProfile, Post, Track, Relationship, db
from app.user import UserAccount, redis_client
from app.utils import create_jwt, jwt_required
from app.extensions import SECRET_KEY

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
check_auth_status_bp = Blueprint("check_auth_status", __name__)
refresh_bp  = Blueprint("refresh_bp", __name__)


# Likes Route

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

# Users Route
@users_bp.route("/api/users/<user_id>", methods=["GET", "POST"])
@jwt_required
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

    # Generate JWT
    access_token = create_jwt(user.id, 'access')
    refresh_token = create_jwt(user.id, 'refresh')

    return jsonify({
        "message": "Login successful",
        "user_id": user.id,
        "token": access_token,  # Include the JWT in the response
        "refresh_token": refresh_token # Include the JWT refresh token in the response
    })

# Profile Route

@profile_bp.route("/api/profile/<username>", methods=["GET", "PATCH"])
@jwt_required
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
@jwt_required
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
@jwt_required
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
    """
    Generates Spotify authorization URL and stores the entire UserAccount object in Redis.
    """
    user_account = UserAccount()
    login_data = user_account.login()

    # Serialize the user_account object (entire object) for later use
    serialized_user_account = pickle.dumps(user_account)

    # Store the serialized object as binary data in Redis with a short expiration (5 minutes)
    redis_client.setex(f"spotify_user_account:{login_data['state']}", 300, serialized_user_account)

    # Store state in Redis with a short expiration for validation
    redis_client.setex(f"spotify_state:{login_data['state']}", 300, "active")

    return jsonify(login_data)

# Spotify Auth Route
@spotify_auth.route("/auth", methods=["GET"])
def spotify_auth_route():
    """
    Handles Spotify OAuth callback, exchanges the auth code for an access token.
    """
    auth_code = request.args.get("code")
    state = request.args.get("state")

    if not state:
        return jsonify({"error": "Authorization code or state parameter missing"}), 400

    if not auth_code:
        redis_client.setex(f"spotify_state:{state}", 300,"failure")
        return jsonify({"error": "Authorization code or state parameter missing"}), 400

    # Validate state in Redis
    if not redis_client.get(f"spotify_state:{state}"):
        redis_client.setex(f"spotify_state:{state}", 300,"failure")
        return jsonify({"error": "Invalid or expired state parameter"}), 400

    try:
        # Retrieve the serialized user_account object from Redis as binary data
        serialized_user_account: bytes = redis_client.get(f"spotify_user_account:{state}")
        if serialized_user_account:
            user_account: UserAccount = pickle.loads(serialized_user_account)  # Deserialize binary data into object
        else:
            redis_client.setex(f"spotify_state:{state}", 300,"failure")
            return jsonify({"error": "User account not found"}), 400

        # Proceed with the token exchange, keeping the same `user_account` object
        token_info = user_account.on_login(auth_code, state)

        if not token_info or "error" in token_info:
            redis_client.setex(f"spotify_state:{state}", 300,"failure")
            return jsonify({"error": "Authentication failed"}), 400

        sp = user_account.sp.current_user()
        user = db.session.execute(select(User).where(User.email==sp['email'])).scalar()
        # Fetch Spotify data or perform any additional actions
        redis_client.setex(f"spotify_state:{state}", 300, "success")
        redis_client.setex(f"user_state:{state}", 300, f"{user.email}")

        return jsonify({
            "message": "Authentication successful",
            "token_info": token_info,
        })

    except Exception as e:
        print("Error during token exchange:", e)
        redis_client.setex(f"spotify_state:{state}", 300,"failure")

        return jsonify({"error": "Internal Server Error"}), 500
    
@check_auth_status_bp.route("/api/check-auth-status", methods=["GET"])
def check_auth_status():
    """
    Checks the status of the authentication process for a given state.
    """
    state = request.args.get("state")
    if not state:
        return jsonify({"status": "failure", "message": "State parameter missing"}), 400

    # Check if the state exists in Redis
    auth_status = redis_client.get(f"spotify_state:{state}")
    print(auth_status)
    if auth_status == b"active":
        # Authentication is still in progress
        return jsonify({"status": "pending", "message": "Authentication in progress"}), 200

    elif auth_status == b"failure":
        # Authentication failed
        return jsonify({"status": "failure", "message": "Authentication failed"}), 200
    elif auth_status == b"success":
        # Get user email/ID from Redis (stored during Spotify auth)
        user_email_bytes: bytes = redis_client.get(f"user_state:{state}")  # Returns bytes

        if not user_email_bytes:
            return jsonify({"error": "User account not found"}), 400

        # Decode bytes to string
        user_email = user_email_bytes.decode('utf-8')

        # Query the user by email
        user = db.session.execute(
            select(User).where(User.email == user_email)
        ).scalar()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Generate JWT
        access_token = create_jwt(user.id, 'access')
        refresh_token = create_jwt(user.id, 'refresh')

        return jsonify({
            "status": "success",
            "message": "Authentication successful",
            "token": access_token,  # Include the JWT in the response
            "refresh_token": refresh_token
        }), 200


    else:
        return jsonify({"status": "failure", "message": "state incorrect or invalid"}), 400
        
        
    
# Tracks Route

@tracks_bp.route("/api/track/<track_uri>", methods=["GET", "POST"])
@jwt_required
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

@getPostsUser_bp.route("/api/getPostsUser", methods=["GET"])
@jwt_required
def get_posts_from_followed_users():
    user_id = request.user_id

    following = db.session.execute(
        select(Relationship).where(Relationship.follower_id == user_id)
    ).scalars().all()

    print(request.headers)

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
@jwt_required
def follow_user(user_id):
    data = request.get_json()
    profile_user_id = data.get("profileUserId")

    if not profile_user_id:
        return jsonify({"error": "Missing profileUserId"}), 400

    relation = Relationship(follower_id=user_id, following_id=profile_user_id)
    db.session.add(relation)
    db.session.commit()

    return jsonify({"message": "Follower added successfully"})

@refresh_bp.route("/refresh", methods=["POST"])
def refresh_token():
    refresh_token = request.json.get('refresh_token')
    if not refresh_token:
        return jsonify(error="Refresh token required"), 401

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
        if payload.get('type') != 'refresh':
            return jsonify(error="Invalid token type"), 401
    except jwt.ExpiredSignatureError:
        return jsonify(error="Refresh token expired"), 401
    except jwt.InvalidTokenError:
        return jsonify(error="Invalid refresh token"), 401

    user_id = payload.get('user_id')
    new_access_token = create_jwt(user_id, "access")
    return jsonify(access_token=new_access_token)