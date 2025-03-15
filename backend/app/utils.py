from functools import wraps
import os
import secrets
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta, timezone
from flask import jsonify, make_response, request
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
    Gera um JWT para o usuário especificado.
    """
    expiration = {
        'access': timedelta(minutes=15),  # Token de acesso de curta duração
        'refresh': timedelta(days=7)      # Token de refresh de longa duração
    }.get(token_type, timedelta(minutes=15))

    payload = {
        "user_id": user_id,
        "type": token_type,
        "exp": datetime.now(tz=timezone.utc) + expiration,  # Expiração
        "iat": datetime.now(tz=timezone.utc),  # Emitido em
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_jwt(token):
    """
    Verifica um JWT e retorna o payload decodificado.
    Retorna None se o token for inválido ou expirado.
    """
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return "expired"
    except jwt.InvalidTokenError:
        return None

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401

        token_parts = auth_header.split(" ")
        if len(token_parts) != 2 or token_parts[0] != "Bearer":
            return jsonify({"error": "Invalid token format"}), 401

        access_token = token_parts[1]
        payload = verify_jwt(access_token)

        if payload == "expired":
            refresh_token = request.cookies.get("refresh_token")
            print(f"Refresh Token: {refresh_token}")  # <-- Log do refresh token

            refresh_payload = verify_jwt(refresh_token)
            if refresh_payload and refresh_payload["type"] == "refresh":
                request.user_id = refresh_payload["user_id"]
                print("USER ID :: ", request.user_id)
                new_access_token = create_jwt(refresh_payload["user_id"], "access")
                response = make_response(f(*args, **kwargs))
                response.headers["Authorization"] = f"Bearer {new_access_token}"
                return response
            else:
                return jsonify({"error": "Refresh token is invalid or expired"}), 401

        elif not payload:
            return jsonify({"error": "Invalid token"}), 401

        request.user_id = payload["user_id"]
        print(f"User ID: {request.user_id}")  # <-- Log do usuário autenticado
        return f(*args, **kwargs)

    return decorated_function


def encrypt_data(data):
    data_copy: str = data
    return cipher_suite.encrypt(data_copy.encode()).decode()

def decrypt_data(encrypted_data):
    return cipher_suite.decrypt(encrypted_data.encode()).decode()