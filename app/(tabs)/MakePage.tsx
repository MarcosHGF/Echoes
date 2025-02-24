import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const CreatePostPage = () => {
  const [postType, setPostType] = useState('lyrics');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const trendingPosts = [
    { id: 1, title: 'Summer Vibes', author: 'User 1', likes: 1200 },
    { id: 2, title: 'Heartbreak Anthem', author: 'User 2', likes: 980 },
    { id: 3, title: 'City Lights', author: 'User 3', likes: 850 },
  ];

  const handlePost = () => {
    // Handle posting logic here
    console.log('Posting:', { type: postType, title, content });
    // Reset fields after posting
    setTitle('');
    setContent('');
    // Optionally, navigate back to the main page
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Post Type Selection */}
        <View style={styles.postTypeContainer}>
          <TouchableOpacity
            style={[styles.postTypeButton, postType === 'lyrics' && styles.activePostType]}
            onPress={() => setPostType('lyrics')}
          >
            <Text style={[styles.postTypeText, postType === 'lyrics' && styles.activePostTypeText]}>Lyrics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.postTypeButton, postType === 'sample' && styles.activePostType]}
            onPress={() => setPostType('sample')}
          >
            <Text style={[styles.postTypeText, postType === 'sample' && styles.activePostTypeText]}>Sample</Text>
          </TouchableOpacity>
        </View>

        {/* Post Creation Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder={postType === 'lyrics' ? "Write your lyrics here..." : "Describe your sample..."}
            placeholderTextColor="#999"
            multiline
            value={content}
            onChangeText={setContent}
          />
          {postType === 'sample' && (
            <TouchableOpacity style={styles.uploadButton}>
              <Feather name="upload" size={24} color="#00E5FF" />
              <Text style={styles.uploadButtonText}>Upload Audio File</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Trending Posts */}
        <View style={styles.trendingContainer}>
          <Text style={styles.sectionTitle}>Trending Posts</Text>
          {trendingPosts.map((post) => (
            <View key={post.id} style={styles.trendingPost}>
              <View style={styles.trendingPostInfo}>
                <Text style={styles.trendingPostTitle}>{post.title}</Text>
                <Text style={styles.trendingPostAuthor}>{post.author}</Text>
              </View>
              <View style={styles.trendingPostLikes}>
                <Feather name="heart" size={16} color="#00E5FF" />
                <Text style={styles.trendingPostLikesCount}>{post.likes}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    color: '#00E5FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  postTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  postTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activePostType: {
    backgroundColor: '#00E5FF',
  },
  postTypeText: {
    color: '#fff',
    fontSize: 16,
  },
  activePostTypeText: {
    color: '#030303',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
  },
  uploadButtonText: {
    color: '#00E5FF',
    marginLeft: 10,
    fontSize: 16,
  },
  trendingContainer: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  trendingPost: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  trendingPostInfo: {
    flex: 1,
  },
  trendingPostTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendingPostAuthor: {
    color: '#999',
    fontSize: 14,
  },
  trendingPostLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingPostLikesCount: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default CreatePostPage;
