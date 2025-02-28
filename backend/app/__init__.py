from flask import Flask
from flask_migrate import Migrate
from app.extensions import db

def create_app():
    app = Flask(__name__)

    # Configuração do banco de dados SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Evita warning desnecessário

    # Configuração para PostgresSQL
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://usuario:senha@localhost:5433/nome_do_banco'
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False



    db.init_app(app)
    migrate = Migrate(app, db)  # Initialize Flask-Migrate
    
    # Import and register blueprints
    from app.routes import likes_bp, users_bp, profile_bp, login_bp, posts_bp, spotify_login, tracks_bp, userposts_bp, getPostsUser_bp, add_follower_bp
    app.register_blueprint(likes_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(posts_bp)
    app.register_blueprint(userposts_bp)
    app.register_blueprint(spotify_login)
    app.register_blueprint(tracks_bp)
    app.register_blueprint(getPostsUser_bp)
    app.register_blueprint(add_follower_bp)

    
    return app

