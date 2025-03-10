import secrets
import jwt
from datetime import datetime, time
from flask import jsonify
from app.extensions import SECRET_KEY, TOKEN_EXPIRATION

def generate_state():
    return secrets.token_urlsafe(16)  # Generates a random 16-byte string



def create_jwt(user_id):
    """
    Generates a JWT for the given user ID.
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.now("UTC") + TOKEN_EXPIRATION,  # Token expiration
        "iat": datetime.now("UTC"),  # Issued at
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