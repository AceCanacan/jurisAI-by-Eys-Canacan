import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SummaryDetailPage = ({ route, navigation }) => {
  const { content, index } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    Alert.alert(
      'Edit Confirmation',                          
      'Are you sure you want to edit this summary?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Edit cancelled'),
          style: 'cancel',
        },
        {
          text: 'Edit',
          onPress: () => setIsEditing(true),
        },
      ],
      { cancelable: false }
    );
  };
  
  const handleSaveEdit = async () => {
    try {
      const currentSummaries = await AsyncStorage.getItem('summaries');
      if (currentSummaries) {
        const parsedSummaries = JSON.parse(currentSummaries);
        if (Array.isArray(parsedSummaries) && index >= 0 && index < parsedSummaries.length) {
          // Create a copy of the summary object and update its content
          const updatedSummary = { ...parsedSummaries[index], content: editedContent };
          // Update the array with the modified summary
          parsedSummaries[index] = updatedSummary;
          // Save the updated array back to AsyncStorage
          await AsyncStorage.setItem('summaries', JSON.stringify(parsedSummaries));
          setIsEditing(false);
        } else {
          // Handle invalid index or parsedSummaries
          console.error('Invalid index or parsedSummaries.');
        }
      }
    } catch (error) {
      // Handle AsyncStorage errors
      console.error('Error while saving edit:', error);
    }
  };


  const handleDelete = () => {
    // Prompt the user with a confirmation alert
    Alert.alert(
      'Delete Confirmation',                          // Alert title
      'Are you sure you want to delete this summary? This action cannot be undone.',    // Alert message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            // If the user confirms the deletion, execute the deletion logic
            const currentSummaries = await AsyncStorage.getItem('summaries');
            if (currentSummaries) {
              const parsedSummaries = JSON.parse(currentSummaries);
              // Remove the summary at the specified index
              parsedSummaries.splice(index, 1);
              await AsyncStorage.setItem('summaries', JSON.stringify(parsedSummaries));
              navigation.goBack();
            }
          },
          style: 'destructive',  // This will color the option red on iOS
        },
      ],
      { cancelable: false }
    );
  };
  
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <TouchableOpacity 
            style={{ marginRight: 10 }}
            onPress={handleDelete}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Helvetica', fontSize: 18 }}>
              Delete
            </Text>
          </TouchableOpacity>
          {/* Add your Edit/Save button here with the same style */}
        </View>
      ),
    });
  }, [navigation, isEditing]);
  

  return (
    <View style={styles.container}>
      {isEditing ?
        <TextInput 
          style={styles.contentText}
          value={editedContent}
          onChangeText={setEditedContent}
          multiline={true}
        />
        :
        <ScrollView>
          <Text style={styles.contentText}>{content}</Text>
        </ScrollView>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  contentText: {
    fontSize: 16,
    color: '#333',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
});

export default SummaryDetailPage;