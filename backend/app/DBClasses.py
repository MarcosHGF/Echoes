from datetime import datetime, timezone
from app.extensions import db
from sqlalchemy import select, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash

class Like(db.Model):
    __tablename__ = 'like'

    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('post.id'), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False, index=True)
    completed = Column(Integer, default=0)
    name = Column(String(200))
    date_created = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    @staticmethod
    def get_like_data(post_id) -> list:
        post_likes = db.session.execute(
            select(Like).where(Like.post_id == post_id)
        ).scalars().all()

        return [
            {
                "id": like.id,
                "post_id": like.post_id,
                "user_id": like.user_id,
                "completed": like.completed,
                "date_created": like.date_created.isoformat() if like.date_created else None
            }
            for like in post_likes
        ]

    @staticmethod
    def add_like(data, post_id):
        db.session.begin()
        name = data.get("name")
        user_id = data.get("id")

        post = db.session.execute(select(Post).where(Post.id == post_id)).scalar()
        if post is None:
            db.session.rollback()
            return {"error": "Post not found"}

        like = Like(name=name, post_id=post_id, user_id=user_id)
        db.session.add(like)

        post.likes += 1
        db.session.commit()
        return {"message": f"Like from {user_id} added to post {post_id}"}

class User(db.Model):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(200), nullable=False, unique=True, index=True)
    username = Column(String(200), nullable=False, unique=True)
    spotify_client = Column(String(200), unique=True)
    name = Column(String(200))
    password = Column(String(260), nullable=False)
    date_created = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed = Column(Integer, default=0)

    profile = relationship("UserProfile", uselist=False, back_populates="user")
    posts = relationship("Post", back_populates="user")

    @staticmethod
    def get_user_data(user_id):
        user = db.session.execute(select(User).where(User.id == user_id)).scalar()
        if not user:
            return {"error": "User not found"}

        return {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "completed": user.completed,
            "date_created": user.date_created.isoformat() if user.date_created else None
        }

    @staticmethod
    def add_user(data):
        email = data.get("email")
        username = data.get("username")
        password = generate_password_hash(data.get("password"))

        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        return {"message": "User added successfully"}

class Post(db.Model):
    __tablename__ = 'post'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    date_created = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed = Column(Integer, default=0)
    content = Column(String(250), nullable=False)
    likes = Column(Integer, default=0)
    tags_id = Column(Integer, unique=True)

    user = relationship("User", back_populates="posts")

    @staticmethod
    def get_post(post_id):
        post = db.session.execute(select(Post).where(Post.id == post_id)).scalar()
        if not post:
            return {"error": "Post not found"}

        return {
            "id": post.id,
            "name": post.name,
            "completed": post.completed,
            "date_created": post.date_created.isoformat() if post.date_created else None
        }

    @staticmethod
    def add_post(data):
        post = Post(name=data.get("name"), user_id=data.get("user_id"), content=data.get("content"))
        db.session.add(post)
        db.session.commit()
        return {"message": "Post added"}

class UserProfile(db.Model):
    __tablename__ = 'user_profile'

    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True, index=True)
    musics = Column(String(200))
    spotify_client = Column(String(200), nullable=False, unique=True)
    pfp = Column(String(300))
    tags = Column(String(300))

    user = relationship("User", back_populates="profile")

    @staticmethod
    def get_user_profile(user_id):
        profile = db.session.execute(select(UserProfile).where(UserProfile.user_id == user_id)).scalar()
        if not profile:
            return {"error": "User profile not found"}

        return {
            "id": profile.user_id,
            "name": profile.user.name,
            "username": profile.user.username,
            "pfp": profile.pfp,
            "musics": profile.musics,
        }

class Relationship(db.Model):
    __tablename__ = 'relationship'

    follower_id = Column(Integer, ForeignKey('user.id'), primary_key=True, index=True)
    following_id = Column(Integer, ForeignKey('user.id'), primary_key=True, index=True)
    date_created = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed = Column(Integer, default=0)

    @staticmethod
    def get_relationship_followers(user_id):
        relations = db.session.execute(select(Relationship).where(Relationship.following_id == user_id)).scalars().all()
        return [{"follower_id": rel.follower_id, "date_created": rel.date_created.isoformat()} for rel in relations]
