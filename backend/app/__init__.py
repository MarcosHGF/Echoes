from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configuração do banco de dados SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Evita warning desnecessário

    db.init_app(app)
    
    # Inicializa o banco de dados
    with app.app_context():
        db.create_all()

    # Import and register blueprints
    from app.routes import likes_bp, users_bp
    app.register_blueprint(likes_bp)
    app.register_blueprint(users_bp)

    return app
