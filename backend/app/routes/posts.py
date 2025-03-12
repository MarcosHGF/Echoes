from flask import Blueprint, jsonify, request
from sqlalchemy import select
from app.utils import jwt_required
from app.DBClasses import Post, Relationship, db


posts_bp = Blueprint("posts", __name__)
userposts_bp = Blueprint("userposts", __name__)
getPostsUser_bp = Blueprint("getPostsUser", __name__)

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