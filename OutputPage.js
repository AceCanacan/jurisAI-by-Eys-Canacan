import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,  // <-- Add this
} from 'react-native';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = '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';

export const saveSummaryToStorage = async (summaryObj) => {
  try {
    const existingSummaries = await AsyncStorage.getItem('summaries');

    if (existingSummaries !== null) {
      const updatedSummaries = JSON.parse(existingSummaries);
      updatedSummaries.push(summaryObj);
      await AsyncStorage.setItem('summaries', JSON.stringify(updatedSummaries));
    } else {
      await AsyncStorage.setItem('summaries', JSON.stringify([summaryObj]));
    }
  } catch (error) {
    console.error('Failed to save the summary:', error);
  }
};

const OutputPage = ({ route }) => {
  const { messages } = route.params;
  const [summary, setSummary] = React.useState({date: '', content: ''});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getSummary = async () => {
      try {
        setLoading(true); 

        // Filter out system messages
        const userMessages = messages.filter(message => message.role !== 'system');

        const response = await axios.post(API_URL, {
          model: 'gpt-4',
          messages: [...userMessages, {
            role: 'user',
            content: `ChatGPT, you are now in the analysis phase of this legal consultation under Philippine Jurisdiction. Focus on Philippine Law. 
            Your role is to review and comprehend all the information shared by the client during the previous interactions. 
            Here are the key steps you should follow:
            Summarize the Situation: Start by providing a brief, understandable summary of the client's situation. 
            This summary should not include any legal interpretations yet. It should simply reflect the facts and details shared by the client to ensure that you have correctly understood their circumstances.
            Legal Analysis: Next, perform a legal analysis of the client's situation based on the information they provided. 
            Use precise and accurate legal terms to explain the potential legal implications, rights, responsibilities, and potential legal avenues available to the client. 
            This analysis should be based on the legal norms, precedents, and regulations that apply to the case. 
            Make sure to explain these terms in a way that is comprehensible to a layperson.
            Course of Action: Finally, provide a list of possible actions the client could take to address their situation. 
            This should be based on the legal analysis you've done and should consider the client's specific needs and circumstances. 
            Discuss the potential benefits, risks, and consequences of each option, and remind the client that your suggestions are not definitive legal advice and should be reviewed with a qualified legal professional.
            Remember to communicate empathetically and professionally throughout this process. Your goal is to help the client understand their situation better and guide them towards possible next steps.`,
          }],
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        const fetchedSummary = {
          date: new Date().toISOString(),
          content: response.data.choices[0].message.content.trim()
        };
        setSummary(fetchedSummary);
        saveSummaryToStorage(fetchedSummary);
        route.params.summary = response.data.choices[0].message.content.trim();
        
        setLoading(false);
      } catch (error) {
        console.error("Error response from OpenAI:", error.response.data);
        setLoading(false);  // Stop the loading spinner if there's an error
      }
    };
    
    getSummary();
  }, [messages]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6c5ce7" />
      ) : (
        <ScrollView style={styles.outputBox}>
          <Text style={styles.summaryText}>{summary.content}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Changing to a pure white for a cleaner look
    padding: screenWidth * 0.05, // Dynamic padding based on screen width
    justifyContent: 'center',
    alignItems: 'center',
  },

  summaryText: {
    fontSize: screenWidth * 0.04, // Make font size dynamic
    color: '#333', // A dark gray for better legibility and aesthetics
  },
  image: {
    margin: screenWidth * 0.05,
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    borderRadius: (screenWidth * 0.7) / 2, // Makes the image circular if the image is a square
  },
});


export default OutputPage;