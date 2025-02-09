from datetime import datetime, timezone
from app import db 

# Modelo da tabela "Todo"
class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    post_id = db.Column(db.Integer, nullable=False, index=True)  # Can have duplicates, indexed for performance
    username = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)  # No auto_increment
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp

    #returns a list of likes and it's data
    @staticmethod
    def getLikeData(postID) -> list:
        post_likes = Likes.query.filter_by(post_id=postID).all()  # Fetch all matching rows
        return [
            {
                "id": like.id,
                "post_id": like.post_id,
                "username": like.username,
                "completed": like.completed,
                "likes": like.likes,
                "date_created": like.date_created.isoformat() if like.date_created else None
            }
            for like in post_likes
        ]

    @staticmethod
    def addLike(data):
        dbdata = data.get("username")
        dbid = data.get("id")
        dbdata = Likes(username=dbdata, post_id=dbid)
        print(dbdata)
        db.session.add(dbdata)
        db.session.commit()
        return

    def __repr__(self):
        return f'<Like {self.id} on Post {self.post_id}>'

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    username = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)  # No auto_increment
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Correct timestamp

    @staticmethod
    def getUserData(userID) -> list:
        userData = Users.query.filter_by(id=userID).all() 

        return [
            {
                "id": user.id,
                "post_id": user.post_id,
                "username": user.username,
                "completed": user.completed,
                "likes": user.likes,
                "date_created": user.date_created.isoformat() if user.date_created else None
            }
            for user in userData
        ]