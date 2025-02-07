from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

app = Flask(__name__)

# adiciona a config de DB local com teste.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
# Adicionando DB sqlite para testes de requests e queries

#instância a db para SQLAlchemy com o app
db = SQLAlchemy(app)

#modelo simples de db
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Integer, default = 0)
    date_created = db.Column(db.DateTime, default=datetime.now()) # Date time retorna o padrão do computador, portantoprecisa achar uma forma de update mais certs, a documentação tem pouca informação

    def __repr__(self):
        return '<Task %r>' % self.id

# É necessário utilizar o contexto atual do app para inicializar a database (sqlite para testes neste caso)
# with app.app_context():
#     db.create_all()

# Ainda é possivle melhorar a inicialização com, dessa forma cria-se apenas as columns não inicializadas para a engine passada
    db.metadata.create_all(db.engine)

# Estrutra para testes antes de DB.
likes = []

# Espera pedidos para likes com método GET ou POST e contúdo application/json
@app.route("/api/likes/<postID>", methods=['GET', 'POST'])
def handle_likes(postID):
    if request.content_type != 'application/json':
        return "Error: Content type must be application/json", 400
   
    #Retorna todos os likes do postID da forma quantidade de like + representação do objeto dados do like
    if request.method == 'GET':
        return str(len(likes)) + repr(likes)


    
    elif request.method == 'POST':
        #Verifica se o postID existe e o adiciona se não
        likes.append(postID)
        # Lê o Json e adiciona para dados do like
        data = json.loads(request.data)
        likes[int(postID)] = data
        return f"<p>Adding a like to post {postID}</p>"
    

if __name__ == "__main__":
    app.run(debug=True)



#TABLE users;                  users -> posts -> userID -> postID;
#TABLE posts;
#TABLE likes;
#TABLE comments;
#TABLE followers;
#TABLE followings;
#TABLE posts_comments;
#TABLE posts_likes; 