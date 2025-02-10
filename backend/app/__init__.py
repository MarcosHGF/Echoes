from flask import Flask
from app.extensions import db

def create_app():
    app = Flask(__name__)

    # Configuração do banco de dados SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Evita warning desnecessário

    db.init_app(app)
    
    # Import and register blueprints
    from app.routes import likes_bp, users_bp
    app.register_blueprint(likes_bp)
    app.register_blueprint(users_bp)

    return app
