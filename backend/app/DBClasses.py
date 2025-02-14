from datetime import datetime, timezone
from app.extensions import db 
from sqlalchemy import select
from werkzeug.security import generate_password_hash

class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    post_id = db.Column(db.Integer, nullable=False, index=True)  # Can have duplicates, indexed for performance
    name = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, nullable=False, index=True)  # Can have duplicates, indexed for performance
    completed = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp

    #returns a list of likes and it's data
    @staticmethod
    def getLikeData(postID) -> list:
        post_likes = db.session.execute(select(Likes).filter(Likes.post_id==postID)).scalars() # all matching rows
        return [
            {
                "id": like.id,
                "post_id": like.post_id,
                "name": like.name,
                "completed": like.completed,
                "date_created": like.date_created.isoformat() if like.date_created else None
            }
            for like in post_likes
        ]

    @staticmethod
    def addLike(data, postID):
        dbname = data.get("name")
        dbid = data.get("id")
        dbdata = Likes(name=dbname, post_id=postID, user_id=dbid)
        print(dbdata)
        db.session.add(dbdata)
        db.session.commit()
        return

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    email = db.Column(db.String(200), nullable=False, unique=True, index=True)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp
    completed = db.Column(db.Integer, default=0)
    senha = db.Column(db.String(260), nullable=False)
    username = db.Column(db.String(200), nullable=False, unique=True)
    spotify_client = db.Column(db.String(200), nullable=False, unique=True)
    name = db.Column(db.String(200), default=username)

    @staticmethod
    def getUserData(userID) -> list:
        userData= db.session.execute(select(Users).where(Users.id==userID)).scalar() 

        return [
            {
                "id": userData.id,
                "name": userData.name,
                "username": userData.username,
                "completed": userData.completed,
                "date_created": userData.date_created.isoformat() if userData.date_created else None
            }
        ]
        
    @staticmethod
    def addUser(data):
        dbemail = data.get("email")
        dbusername = data.get("username")
        dbPasswd = generate_password_hash(data.get("senha"))
        dbdata = Users(username=dbusername, email=dbemail, senha=dbPasswd)
        print(dbdata)
        db.session.add(dbdata)
        db.session.commit()
        return

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    name = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp
    completed = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, index=True) # Primary key
    tags_id = db.Column(db.Integer, unique=True)
    

    @staticmethod
    def getPost(id):
        postData = db.session.execute(select(Post).where(Post.id==id)).scalar_one()

        return [
            {
                "id": postData.id,
                "name": postData.name,
                "completed": postData.completed,
                "date_created": postData.date_created.isoformat() if postData.date_created else None
            }
        ]

class UserProfile(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, index=True) # Primary key
    musics = db.Column(db.String(200))
    spotify_client = db.Column(db.String(200), nullable=False, unique=True)
    name = db.Column(db.String(200), nullable=False, unique=False)
    pfp = db.Column(db.String(300), unique=False)
    tags = db.Column(db.String(300))

    @staticmethod
    def getUserProfile(UserID):
        profile = db.session.execute(select(UserProfile).where(UserProfile.user_id==UserID)).scalar_one()

        return [
            {
                "id": profile.user_id,
                "nome": profile.name,
                "pfp": profile.pfp,
                "musics": profile.musics 
            }
        ]
    

class Relationships(db.Model):
    follower_id = db.Column(db.Integer, primary_key=True, index=True)
    following_id = db.Column(db.Integer, index=True)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp
    completed = db.Column(db.Integer)

    @staticmethod
    def getRelationshipsFollowers(userID):
        dbRelations = db.session.execute(select(Relationships).where(Relationships.following_id==userID)).scalars()
        return dbRelations

