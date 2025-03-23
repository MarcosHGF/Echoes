from app.extensions import db
from sqlalchemy import CheckConstraint, UniqueConstraint, select, Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash
from app.utils import encrypt_data

class User(db.Model):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(200), nullable=False, unique=True, index=True)
    username = Column(String(200), nullable=False, unique=True)
    spotify_id = Column(String(200), unique=True)
    name = Column(String(200))
    password = Column(String(260), nullable=True)  # Encrypted password
    date_created = Column(DateTime, server_default=func.now())

    # Relationships
    profile = relationship("UserProfile", uselist=False, back_populates="user")
    posts = relationship("Post", back_populates="user")
    spotify_credential = relationship("SpotifyCredential", uselist=False, back_populates="user")

    @staticmethod
    def add_user(data):
        email = data.get("email")
        username = data.get("username")
        password = generate_password_hash(password=data.get("password"))  # Encrypt password before storing

        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        UserProfile.add_user_profile(user.id)
        return {"message": "User added successfully"}
    
    @staticmethod
    def add_user_spotify(email, username, spotify_id, access_token, refresh_token, token_expiry, state):
        try:
            user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()
            if not user:
                user = User(username=username, email=email, spotify_id=spotify_id)
                db.session.add(user)
                db.session.commit()

            SpotifyCredential.update_credentials(
                user_id=user.id,
                access_token=access_token, 
                refresh_token=refresh_token, 
                token_expiry=token_expiry,
                state=state
                )
            
            UserProfile.add_user_profile(user.id)
            
        except Exception as e:
            raise e

    @staticmethod
    def get_user_data(user_id):
        user = db.session.execute(select(User).where(User.id == user_id)).scalar()
        if not user:
            return {"error": "User not found"}

        return {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "date_created": user.date_created.isoformat() if user.date_created else None
        }

class UserProfile(db.Model):
    __tablename__ = 'user_profile'

    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True, index=True)
    musics = Column(String(200))
    pfp = Column(String(300))  # Profile picture URL
    tags = Column(String(300))

    user = relationship("User", back_populates="profile")

    @staticmethod
    def get_user_profile(user_id):
        profile = db.session.execute(select(UserProfile).where(UserProfile.user_id == user_id)).scalar()
        if not profile:
            return {"error": f"User profile not found {user_id}"}

        return {
            "id": profile.user_id,
            "name": profile.user.name,
            "username": profile.user.username,
            "pfp": profile.pfp,
            "musics": profile.musics,
        }
    
    @staticmethod
    def add_user_profile(user_id):
        profile = db.session.execute(select(UserProfile).where(UserProfile.id==user_id))
        if profile != None:
            return True
        profile = UserProfile(user_id=user_id)
        db.session.add(profile)
        db.session.commit()
        return True

class SpotifyCredential(db.Model):
    __tablename__ = 'spotify_credential'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False, unique=True, index=True)
    access_token = Column(String(512), nullable=False)  # Encrypted access token
    refresh_token = Column(String(512), nullable=False)  # Encrypted refresh token
    token_expiry = Column(String(200), nullable=False)
    state = Column(String(255), nullable=False)

    user = relationship("User", back_populates="spotify_credential")

    @staticmethod
    def get_credentials(user_id):
        return db.session.execute(
            select(SpotifyCredential).where(SpotifyCredential.user_id == user_id)
        ).scalar()

    @staticmethod
    def update_credentials(user_id, access_token, refresh_token, token_expiry, state):
        print("added", user_id)
        
        credential = db.session.execute(
            select(SpotifyCredential).where(SpotifyCredential.user_id == user_id)
        ).scalar()

        if not credential:
            credential = SpotifyCredential(user_id=user_id)

        credential.access_token = encrypt_data(access_token)
        credential.refresh_token = encrypt_data(refresh_token)
        credential.token_expiry = token_expiry
        credential.state = state
        print("added", credential)
        db.session.add(credential)
        db.session.commit()

class Post(db.Model):
    __tablename__ = 'post'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    content = Column(String(250), nullable=False)
    parent_id = Column(Integer, ForeignKey('post.id'), nullable=True)  # Self-reference for comments
    likes = Column(Integer, default=0)
    date_created = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="posts")
    parent = relationship("Post", remote_side=[id], back_populates="comments")  # Parent post
    comments = relationship("Post", back_populates="parent", cascade="all, delete-orphan")  # Child comments

    @staticmethod
    def add_post(data, user_id, parent_id=None):
        try:
            print("in main try")
            """Adds a new post or comment (if parent_id is provided)."""
            user = db.session.execute(select(User).where(User.id == user_id)).scalar()
            if not user:
                return {"error": "User not found"}

            post = Post(user_id=user.id, content=data.get("content"), name=user.username, parent_id=parent_id)
            db.session.add(post)
            db.session.commit()
            print("added", data.get("content"), "in user", user.username )
            return {"message": "Post added", "post_id": post.id}
        except Exception as error:
            print(error)
            return(error)

    @staticmethod
    def add_comment(post_id, user_id, content):
        """Adds a comment to an existing post."""
        post = db.session.execute(select(Post).where(Post.id == post_id)).scalar()
        if not post:
            return {"error": "Post not found"}

        return Post.add_post({"content": content}, user_id, parent_id=post_id)

    @staticmethod
    def get_post(post_id):
        """Retrieves a post with its comments."""
        post = db.session.execute(select(Post).where(Post.id == post_id)).scalar()
        if not post:
            return {"error": "Post not found"}

        comments = [
            {"id": c.id, "user_id": c.user_id, "content": c.content, "date_created": c.date_created.isoformat()}
            for c in post.comments
        ]

        return {
            "id": post.id,
            "name": post.name,
            "content": post.content,
            "likes": post.likes,
            "comments": comments,
            "date_created": post.date_created.isoformat() if post.date_created else None
        }


class Like(db.Model):
    __tablename__ = 'like'

    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('post.id'), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False, index=True)
    name = Column(String(200))
    date_created = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint('post_id', 'user_id', name='uq_post_user'),
    )

    @staticmethod
    def get_like_data(post_id):
        post_likes = db.session.execute(
            select(Like).where(Like.post_id == post_id)
        ).scalars().all()

        return [
            {
                "id": like.id,
                "post_id": like.post_id,
                "user_id": like.user_id,
                "name": like.name,
                "date_created": like.date_created.isoformat() if like.date_created else None
            }
            for like in post_likes
        ]

    @staticmethod
    def add_like(post_id, user_id):

        user = db.session.execute(select(User).where(User.id==user_id)).scalar_one()

        post = db.session.execute(select(Post).where(Post.id == post_id)).scalar()
        if post is None:
            return {"error": "Post not found"}

        like = Like(name=user.username, post_id=post_id, user_id=user_id)
        db.session.add(like)

        post.likes += 1
        db.session.commit()
        print("Added likes")
        return {"message": f"Like from {user_id} added to post {post_id}"}

class Relationship(db.Model):
    __tablename__ = 'relationship'

    id = Column(Integer, primary_key=True, autoincrement=True)
    follower_id = Column(Integer, ForeignKey('user.id'), index=True)
    following_id = Column(Integer, ForeignKey('user.id'), index=True)
    date_created = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint('follower_id', 'following_id', name='uq_follower_following'),
        CheckConstraint('follower_id <> following_id', name='chk_no_self_follow'),
    )

    @staticmethod
    def get_relationship_followers(user_id):
        relations = db.session.execute(
            select(Relationship).where(Relationship.following_id == user_id)
        ).scalars().all()

        return [
            {
                "follower_id": rel.follower_id,
                "date_created": rel.date_created.isoformat() if rel.date_created else None
            }
            for rel in relations
        ]
    
    @staticmethod
    def get_relationship_following(user_id):
        relations = db.session.execute(
            select(Relationship).where(Relationship.following_id == user_id)
        ).scalars().all()

        return [
            {
                "followed_id": rel.followed_id,
                "date_created": rel.date_created.isoformat() if rel.date_created else None
            }
            for rel in relations
        ]

class Track(db.Model):
    __tablename__ = 'track'

    track_id = Column(Integer, primary_key=True, index=True)
    track_uri = Column(String(255), index=True, unique=True)
    track_photo = Column(String(260))
    track_name = Column(String(260))
    track_artists = Column(String(260))
    track_album = Column(Integer, ForeignKey('album.album_uri'), index=True)

    @staticmethod
    def get_track(track_uri):
        track = db.session.execute(select(Track).where(Track.track_uri == track_uri)).scalar()
        if not track:
            return {"error": "Track not found"}
        return {
            "track_id": track.track_id,
            "track_uri": track.track_uri,
            "track_photo": track.track_photo,
            "track_name": track.track_name,
            "track_artists": track.track_artists,
            "track_album": track.track_album
        }

    @staticmethod
    def add_track(data):
        track = Track(
            track_uri=data.get("uri"),
            track_photo=data.get("track_photo"),
            track_name=data.get("track_name"),
            track_artists=data.get("track_artists"),
            track_album=data.get("track_album")
        )
        db.session.add(track)
        db.session.commit()
        return {"message": "Track added"}

class Album(db.Model):
    __tablename__ = 'album'

    album_id = Column(Integer, primary_key=True, index=True)
    album_uri = Column(String(255), index=True, unique=True)
    album_photo = Column(String(260))
    album_name = Column(String(260))
    album_artists = Column(String(260))

    @staticmethod
    def get_album(album_uri):
        album = db.session.execute(select(Album).where(Album.album_uri == album_uri)).scalar()
        if not album:
            return {"error": "Album not found"}
        return {
            "album_id": album.album_id,
            "album_uri": album.album_uri,
            "album_photo": album.album_photo,
            "album_name": album.album_name,
            "album_artists": album.album_artists
        }

    @staticmethod
    def add_album(data):
        album = Album(
            album_uri=data.get("uri"),
            album_photo=data.get("album_photo"),
            album_name=data.get("album_name"),
            album_artists=data.get("album_artists")
        )
        db.session.add(album)
        db.session.commit()
        return {"message": "Album added"}
