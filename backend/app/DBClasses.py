from datetime import datetime, timezone
from app.extensions import db 
from sqlalchemy import select

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
        post_likes = db.session.execute(select(Likes).filter(Likes.post_id==postID)).fetchall() # Fetch all matching rows
        print(repr(post_likes))
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
    email = db.Column(db.String(200), nullable=False, unique=True)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp
    completed = db.Column(db.Integer, default=0)

    @staticmethod
    def getUserData(userID) -> list:
        userData = db.session.execute(select(Users).where(Users.id==userID)).all() 

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
        dbdata = Users(username=dbusername, email=dbemail)
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
        postData = db.session.execute(select(Post).where(Post.id==id)).first()
                
        return [
            {
                "id": postData.id,
                "username": postData.username,
                "completed": postData.completed,
                "date_created": postData.date_created.isoformat() if postData.date_created else None
            }
        ]
