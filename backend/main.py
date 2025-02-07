from flask import Flask, request
import json

app = Flask(__name__)

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
