from datetime import datetime, timezone
from app.extensions import db 
from sqlalchemy import select
from werkzeug.security import generate_password_hash

class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    post_id = db.Column(db.Integer, nullable=False, index=True)  # Can have duplicates, indexed for performance
    username = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, nullable=False, index=True)  # Can have duplicates, indexed for performance
    completed = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp

    #returns a list of likes and it's data
    @staticmethod
    def getLikeData(postID) -> list:
        db_likes = db.session.execute(select(Likes).filter(Likes.post_id==postID)).fetchall() # Fetch all matching rows
        post_likes = db_likes[0]
        return [
            {
                "id": like.id,
                "post_id": like.post_id,
                "username": like.username,
                "completed": like.completed,
                "date_created": like.date_created.isoformat() if like.date_created else None
            }
            for like in post_likes
        ]

    @staticmethod
    def addLike(data, postID):
        dbname = data.get("username")
        dbid = data.get("id")
        dbdata = Likes(username=dbname, post_id=postID, user_id=dbid)
        print(dbdata)
        db.session.add(dbdata)
        db.session.commit()
        return

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    username = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True, index=True)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp
    completed = db.Column(db.Integer, default=0)
    senha = db.Column(db.String(260), nullable=False)

    @staticmethod
    def getUserData(userID) -> list:
        dbData= db.session.execute(select(Users).where(Users.id==userID)).all() 
        userData = dbData[0]

        return [
            {
                "id": userData.id,
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
    username = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp
    completed = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, index=True) # Primary key

    @staticmethod
    def getPost(id):
        dbData = db.session.execute(select(Post).where(Post.id==id)).first()
        postData = dbData[0]

        return [
            {
                "id": postData.id,
                "username": postData.username,
                "completed": postData.completed,
                "date_created": postData.date_created.isoformat() if postData.date_created else None
            }
        ]
