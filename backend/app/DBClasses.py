from datetime import datetime, timezone
from app.extensions import db
from sqlalchemy import select, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash

class Likes(db.Model):
    __tablename__ = 'likes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('Posts.id'), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('Users.id'), nullable=False, index=True)
    completed = Column(Integer, default=0)
    name = Column(String(200))
    date_created = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    @staticmethod
    def getLikeData(postID) -> list:
        post_likes = db.session.execute(
            select(Likes).filter(Likes.post_id == postID)
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
    def addLike(data, postID):
        db.session.begin()
        dbname = data.get("name")
        dbid = data.get("id")

        # Check if post exists before adding like
        post = db.session.execute(select(Post).where(Post.id == postID)).scalar()
        if post is None:
            db.session.rollback()
            return {"error": "Post not found"}

        dbdata = Likes(name=dbname, post_id=postID, user_id=dbid)
        db.session.add(dbdata)

        post.likes += 1
        db.session.commit()
        return {"message": f"Like from {dbid} added to post {postID}"}


class Users(db.Model):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(200), nullable=False, unique=True, index=True)
    username = Column(String(200), nullable=False, unique=True)
    spotify_client = Column(String(200), unique=True)
    name = Column(String(200))
    senha = Column(String(260), nullable=False)
    date_created = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed = Column(Integer, default=0)

    profile = relationship("UserProfile", uselist=False, back_populates="user")
    posts = relationship("Post", back_populates="user")

    @staticmethod
    def getUserData(userID):
        user = db.session.execute(select(Users).where(Users.id == userID)).scalar()
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
    def addUser(data):
        dbemail = data.get("email")
        dbusername = data.get("username")
        dbPasswd = generate_password_hash(data.get("senha"))

        dbdata = Users(username=dbusername, email=dbemail, senha=dbPasswd)
        db.session.add(dbdata)
        db.session.commit()
        return {"message": "User added successfully"}


class Post(db.Model):
    __tablename__ = 'Posts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('Users.id'), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    date_created = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    tags_id = Column(Integer, unique=True)

    user = relationship("Users", back_populates="posts")

    @staticmethod
    def getPost(post_id):
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
    def getPostsFromUser(userID):
        posts = db.session.execute(select(Post).where(Post.user_id == userID)).scalars().all()
        return [
            {
                "id": post.id,
                "likes": post.likes,
                "completed": post.completed,
                "date_created": post.date_created.isoformat() if post.date_created else None
            }
            for post in posts
        ]

    @staticmethod
    def addpost(data):
        addedPost = Post(name=data.get("name"), user_id=data.get("userID"))
        db.session.add(addedPost)
        db.session.commit()
        return {"Post added"}

class UserProfile(db.Model):
    __tablename__ = 'UserProfile'

    user_id = Column(Integer, ForeignKey('Users.id'), primary_key=True, index=True)
    musics = Column(String(200))
    spotify_client = Column(String(200), nullable=False, unique=True)
    pfp = Column(String(300))
    tags = Column(String(300))

    user = relationship("Users", back_populates="profile")

    @staticmethod
    def getUserProfile(user_id):
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


class Relationships(db.Model):
    __tablename__ = 'relationships'

    follower_id = Column(Integer, ForeignKey('Users.id'), primary_key=True, index=True)
    following_id = Column(Integer, ForeignKey('Users.id'), primary_key=True, index=True)
    date_created = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed = Column(Integer, default=0)

    @staticmethod
    def getRelationshipsFollowers(userID):
        relations = db.session.execute(select(Relationships).where(Relationships.following_id == userID)).scalars().all()
        return [{"follower_id": rel.follower_id, "date_created": rel.date_created.isoformat()} for rel in relations]
