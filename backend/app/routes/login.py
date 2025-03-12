import pickle
from flask import Blueprint, jsonify, request
from sqlalchemy import select
from app.DBClasses import db, User
from app.utils import create_jwt
from werkzeug.security import check_password_hash
from app.user import UserAccount, redis_client

login_bp = Blueprint("login", __name__)
spotify_login = Blueprint("spotify_login", __name__)
spotify_auth = Blueprint("spotify_auth", __name__)
check_auth_status_bp = Blueprint("check_auth_status", __name__)

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