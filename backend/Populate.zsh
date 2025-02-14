#!/bin/zsh

API_URL="http://127.0.0.1:8080/api"

echo "Creating test users..."
curl -X POST $API_URL/users/1 -H "Content-Type: application/json" -d '{
    "email": "user1@example.com",
    "username": "user1",
    "password": "password123"
}'

echo "Adding another user..."
curl -X POST $API_URL/users/2 -H "Content-Type: application/json" -d '{
    "email": "user2@example.com",
    "username": "user2",
    "password": "password456"
}'

sleep 1
echo "Fetching users..."
curl -X GET $API_URL/users/1
curl -X GET $API_URL/users/2

echo "Creating a post..."
curl -X POST $API_URL/posts/1 -H "Content-Type: application/json" -d '{
    "name": "Test Post",
    "user_id": 1
}'

sleep 1
echo "Liking the post..."
curl -X POST $API_URL/likes/1 -H "Content-Type: application/json" -d '{
    "name": "user1",
    "id": 1
}'

sleep 1
echo "Fetching likes..."
curl -X GET {$API_URL}/likes/1

echo "Done populating mock data!"
