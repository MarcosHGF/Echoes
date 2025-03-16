from flask import Blueprint, jsonify, request
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.utils import jwt_required
from app.DBClasses import Post, Relationship, db


posts_bp = Blueprint("posts", __name__)
userposts_bp = Blueprint("userposts", __name__)
getPostsUser_bp = Blueprint("getPostsUser", __name__)
getAllPosts_bp = Blueprint("getAllPosts", __name__)

# Posts Route
@posts_bp.route("/api/posts/<post_id>", methods=["GET", "POST"])
@jwt_required
def handle_posts(post_id):
    data = request.get_json()
    parent_id = data.get("parent_id") if "parent_id" in data else None

    print("in main body")
    if request.method == "POST":
        print("in main if")

        result = Post.add_post(data, request.user_id, parent_id=parent_id)
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

@getAllPosts_bp.route("/api/getAllPosts", methods=["GET"])
@jwt_required
def getAllPosts():
    posts = db.session.execute(
        select(Post)
        .options(joinedload(Post.comments))  # Optimize query to load comments in one go
    ).scalars().unique().all()

    print([serialize_post(post) for post in posts])

    return jsonify([serialize_post(post) for post in posts])

def serialize_post(post):
    """Recursively serialize a post with all its nested comments"""
    return {
        "id": post.id,
        "user": post.name,
        "date": post.date_created.isoformat(),
        "content": post.content,
        "likes": post.likes,
        "comments": [serialize_post(comment) for comment in post.comments]  # Recursive call
    }
