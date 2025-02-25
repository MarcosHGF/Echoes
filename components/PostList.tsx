import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

// Define the shape of a Post object
interface Post {
  id: number;
  user_id: number;
  name: string;
  date_created: string; // ISO date string
  completed: boolean;
  content: string;
  likes: number;
  tags_id: number | null;
}

interface PostListProps {
  userId: number; // Propriedade para receber o user_id
}

const PostList: React.FC<PostListProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from the backend
  const fetchPosts = async (): Promise<void> => {
    try {
      const response = await fetch(`https://select-sheep-currently.ngrok-free.app/api/userposts/1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching posts: ${response.statusText}`);
      }
  
      const data: Post[] = await response.json();
  
      // Ensure the response is an array
      if (!Array.isArray(data)) {
        throw new Error("Expected an array of posts but got something else.");
      }
  
      setPosts(data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching posts:", err.message);
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00E5FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.resourceGrid}>
    {posts && posts.length > 0 ? (
      posts.map((post) => (
        <View key={post.id} style={styles.resourceCard}>
          <View style={styles.resourceHeader}>
            <Text style={styles.resourceType}>{post.completed ? "Completed" : "Active"}</Text>
            <Text style={styles.resourcePrice}>{post.likes} Likes</Text>
          </View>
          <Text style={styles.postName}>{post.name}</Text>
          <Text style={styles.postContent}>{post.content}</Text>
          <View style={styles.resourceStats}>
            <Text style={styles.statText}>
              <Text>{new Date(post.date_created).toLocaleDateString()}</Text>
            </Text>
            <Text style={styles.statText}>
              <Text>{post.likes} Likes</Text>
            </Text>
          </View>
        </View>
      ))
    ) : (
      <Text style={styles.noPostsText}>No posts available.</Text>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  resourceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  resourceCard: {
    backgroundColor: "#1A1A1A",
    width: "48%",
    marginBottom: 15,
    borderRadius: 8,
    padding: 15,
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  resourceType: {
    backgroundColor: "rgba(31, 111, 235, 0.1)",
    color: "#00E5FF",
    padding: 5,
    borderRadius: 10,
    fontSize: 12,
  },
  resourcePrice: {
    color: "#00E5FF",
    fontWeight: "bold",
  },
  postName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    color: "#999",
    fontSize: 14,
    marginBottom: 10,
  },
  resourceStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statText: {
    color: "#999",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#f85149",
    fontSize: 16,
    textAlign: "center",
  },
  noPostsText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default PostList;