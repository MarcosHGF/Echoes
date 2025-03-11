from flask_sqlalchemy import SQLAlchemy
import os
from datetime import timedelta

# Secret key for signing JWTs
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")

# Token expiration time (e.g., 1 hour)
TOKEN_EXPIRATION = timedelta(hours=1)

db = SQLAlchemy()
