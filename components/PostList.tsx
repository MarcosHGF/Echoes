import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Define the shape of a Post object
interface Post {
  id: number;
  user_id: number;
  user: string;
  date: string; // ISO date string
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
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  // Fetch posts from the backend
  const fetchPosts = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://select-sheep-currently.ngrok-free.app/api/userposts/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
  const handleEllipsisPress = (index: number) => {
    setSelectedPost(selectedPost === index ? null : index);
  };

  const handleOptionSelect = (option: string) => {
    console.log(`Selected option: ${option}`);
    setSelectedPost(null);
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
    <View style={styles.container}>
      {/* Section Title */}

      {/* Posts */}
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <View key={post.id} style={styles.post}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <TouchableOpacity
                onPress={() => console.log("Redirect to user profile")}
                style={styles.userInfo}
              >
                <View style={styles.postAvatar} />
                <View>
                  <Text style={styles.postUsername}>{post.user}</Text>
                  <Text style={styles.postTime}>
                    {new Date(post.date).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ellipsisButton}
                onPress={() => handleEllipsisPress(index)}
              >
                <Feather name="more-vertical" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Post Content */}
            <Text style={styles.postContent}>{post.content}</Text>

            {/* Post Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.postAction}>
                <Feather name="heart" size={20} color="#fff" />
                <Text style={styles.postActionText}>{post.likes} Likes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Feather name="message-circle" size={20} color="#fff" />
                <Text style={styles.postActionText}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Feather name="share-2" size={20} color="#fff" />
                <Text style={styles.postActionText}>Share</Text>
              </TouchableOpacity>
            </View>

            {/* Options Menu */}
            {selectedPost === index && (
              <View style={styles.optionsMenu}>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleOptionSelect("Not Interested")}
                >
                  <Text style={styles.optionText}>Not Interested</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleOptionSelect("Report")}
                >
                  <Text style={styles.optionText}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleOptionSelect("Favorite")}
                >
                  <Text style={styles.optionText}>Favorite</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noPostsText}>No posts available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
    paddingHorizontal: 20,
  },
  sectionTitle: {
    paddingVertical: 10,
  },
  sectionTitleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  post: {
    backgroundColor: "#1A1A1A",
    marginBottom: 20,
    borderRadius: 8,
    padding: 15,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    marginRight: 10,
  },
  postUsername: {
    color: "#fff",
    fontWeight: "bold",
  },
  postTime: {
    color: "#999",
    fontSize: 12,
  },
  postContent: {
    color: "#fff",
    marginBottom: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  postActionText: {
    color: "#fff",
    marginLeft: 5,
  },
  ellipsisButton: {
    padding: 5,
  },
  optionsMenu: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 10,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
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
