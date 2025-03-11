import copy
from functools import wraps
import os
import secrets
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta, timezone
from flask import jsonify
from app.extensions import SECRET_KEY
from cryptography.fernet import Fernet

load_dotenv()
# Encryption setup
ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY').encode()
cipher_suite = Fernet(ENCRYPTION_KEY)


def generate_state():
    return secrets.token_urlsafe(16)  # Generates a random 16-byte string

def create_jwt(user_id, token_type='access'):
    """
    Generates a JWT for the given user ID.
    """
    expiration = {
        'access': timedelta(minutes=15),  # Short-lived access token
        'refresh': timedelta(days=7)      # Long-lived refresh token
    }[token_type]

    payload = {
        "user_id": user_id,
        "type": token_type,
        "exp": datetime.now(tz=timezone.utc) + expiration,  # Token expiration
        "iat": datetime.now(tz=timezone.utc),  # Issued at
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def verify_jwt(token):
    """
    Verifies a JWT and returns the decoded payload.
    Returns None if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        print("Token has expired.")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token.")
        return None
    
    from functools import wraps
from flask import request, jsonify

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401

        # Extract token from "Bearer <token>"
        token = auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else None
        print(token)
        if not token:
            return jsonify({"error": "Invalid token format"}), 401

        # Verify token
        payload = verify_jwt(token)
        print(payload)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Attach user_id to the request context
        request.user_id = payload["user_id"]
        return f(*args, **kwargs)

    return decorated_function

def encrypt_data(data):
    data_copy: str = data
    return cipher_suite.encrypt(data_copy.encode()).decode()

def decrypt_data(encrypted_data):
    return cipher_suite.decrypt(encrypted_data.encode()).decode()