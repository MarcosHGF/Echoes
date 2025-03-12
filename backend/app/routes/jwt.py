
from flask import Blueprint, jsonify, request
import jwt
from app.utils import create_jwt
from app.extensions import SECRET_KEY


refresh_bp  = Blueprint("refresh_bp", __name__)


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