import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import apiClient from "../app/utils/aptClient";
import CommentCreationModal from "./CommentCreationModal";
import { useNavigation } from "@react-navigation/native";
import { navigate } from "expo-router/build/global-state/routing";
import { Navigation } from "lucide-react";

// Updated Post interface to include comments
interface Post {
  id: number;
  user_id: number;
  user: string;
  date: string;
  completed: boolean;
  content: string;
  likes: number;
  tags_id: number | null;
  comments?: Post[]; // Added comments array
}

// Comment Thread component for nested comments
const CommentThread: React.FC<{
  comments: Post[];
  onReply: (postId: number, commentId?: number) => void;
}> = ({ comments, onReply }) => {
  return (
    <View style={styles.commentContainer}>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.comment}>
          <View style={styles.commentHeader}>
            <View style={styles.commentUserInfo}>
              <View style={styles.commentAvatar} />
              <Text style={styles.commentUser}>{comment.user}</Text>
            </View>
            <Text style={styles.commentTime}>
              {new Date(comment.date).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.commentContent}>{comment.content}</Text>

          <View style={styles.commentActions}>
            <TouchableOpacity style={styles.commentAction}>
              <Feather name="heart" size={14} color="#fff" />
              <Text style={styles.commentActionText}>
                {comment.likes} Likes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.commentAction}
              onPress={() => onReply(comment.id, comment.id)}
            >
              <Feather name="message-circle" size={14} color="#fff" />
              <Text style={styles.commentActionText}>Reply</Text>
            </TouchableOpacity>
          </View>

          {comment.comments && comment.comments.length > 0 && (
            <CommentThread comments={comment.comments} onReply={onReply} />
          )}
        </View>
      ))}
    </View>
  );
};

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [activePostId, setActivePostId] = useState<number | undefined>(
    undefined
  );
  const [activeCommentId, setActiveCommentId] = useState<number | undefined>(
    undefined
  );

  const navigation = useNavigation();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/getAllPosts");
      const data: Post[] = response.data;

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
  }, []);

  const handleEllipsisPress = (index: number) => {
    setSelectedPost(selectedPost === index ? null : index);
  };

  const handleOptionSelect = (option: string) => {
    console.log(`Selected option: ${option}`);
    setSelectedPost(null);
  };

  const handleLike = async (postID: number) => {
    const response = await apiClient.post(`/api/likes/${postID}`);
    if (response.status != 200) {
      console.log("Failed like");
      return;
    }
  };

  const handleCommentPress = (postId: number) => {
    setActivePostId(postId);
    setActiveCommentId(undefined);
    setCommentModalVisible(true);
  };

  const handleReplyPress = (postId: number, commentId?: number) => {
    setActivePostId(postId);
    setActiveCommentId(commentId);
    setCommentModalVisible(true);
  };

  const handleCommentAdded = () => {
    // Refresh posts to show the new comment
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {posts.length >= 0 ? (
        posts.map((post, index) => (
          <View key={post.id} style={styles.post}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <TouchableOpacity
                onPress={() => {
                  navigation.setParams({ user: post.user });
                  navigation.navigate("(tabs)/ProfilePage");
                }}
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
              <TouchableOpacity
                style={styles.postAction}
                onPress={() => handleLike(post.id)}
              >
                <Feather name="heart" size={20} color="#fff" />
                <Text style={styles.postActionText}>{post.likes} Likes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.postAction}
                onPress={() => handleCommentPress(post.id)}
              >
                <Feather name="message-circle" size={20} color="#fff" />
                <Text style={styles.postActionText}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Feather name="share-2" size={20} color="#fff" />
                <Text style={styles.postActionText}>Share</Text>
              </TouchableOpacity>
            </View>

            {/* Nested Comments */}
            {post.comments && post.comments.length > 0 && (
              <CommentThread
                comments={post.comments}
                onReply={(commentId) => handleReplyPress(post.id, commentId)}
              />
            )}

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

      {/* Comment Modal */}
      <CommentCreationModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        postId={activePostId}
        parentCommentId={activeCommentId}
        onCommentAdded={handleCommentAdded}
      />
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
  // Comment styles
  commentContainer: {
    marginLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: "#444",
    paddingLeft: 10,
    marginTop: 10,
  },
  comment: {
    backgroundColor: "#252525",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    alignItems: "center",
  },
  commentUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
    marginRight: 8,
  },
  commentUser: {
    color: "#fff",
    fontWeight: "bold",
  },
  commentTime: {
    color: "#888",
    fontSize: 12,
  },
  commentContent: {
    color: "#fff",
  },
  commentActions: {
    flexDirection: "row",
    marginTop: 5,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  commentActionText: {
    color: "#fff",
    marginLeft: 5,
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
});

export default PostList;
