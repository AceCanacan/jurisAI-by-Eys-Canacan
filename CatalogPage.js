import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryDetailPage from './SummaryDetailPage';

const CatalogPage = ({ navigation }) => {
  const [summaries, setSummaries] = useState([]);

  const fetchSummaries = async () => {
    try {
      const storedSummaries = await AsyncStorage.getItem('summaries');
      if (storedSummaries !== null) {
        setSummaries(JSON.parse(storedSummaries));
        console.log("Stored Summaries:", storedSummaries);
      }
    } catch (error) {
      console.error('Failed to fetch summaries:', error);
    }
  };

  // Use this effect to add the focus listener
  useEffect(() => {
    // Call fetchSummaries when the screen is focused
    const unsubscribe = navigation.addListener('focus', fetchSummaries);
    
    // Call fetchSummaries initially as well
    fetchSummaries();

    // Clean up the listener on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
{summaries.map((summary, index) => {
    let content = summary.content;

    // Check for nested content structure and extract content string
    if (typeof content === 'object' && content.content) {
        content = content.content;
    }

    // Additional check for empty content
    if (!content || typeof content !== 'string') {
        console.warn('Invalid summary detected:', summary);
        return null;
    }

    return (
        <TouchableOpacity 
            key={index} 
            style={styles.summaryItem}
            onPress={() => navigation.navigate('SummaryDetail', { content: content, index: index })}
        >
            <Text style={styles.dateText}>{new Date(summary.date).toLocaleDateString()}</Text>
            <Text numberOfLines={1} style={styles.summaryText}>{content}</Text>
        </TouchableOpacity>
    );
})}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  summaryItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  summaryText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default CatalogPage;
