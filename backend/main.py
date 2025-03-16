from flask import Flask
from app import create_app, db
from flask_cors import CORS

app: Flask = create_app()
CORS(app, supports_credentials=True)

def print_routes():
    for rule in app.url_map.iter_rules():
        print(rule)

print_routes()

# Inicializa o banco de dados
with app.app_context():
    db.create_all() 

if __name__ == "__main__":
    app.debug = True
    app.run()
