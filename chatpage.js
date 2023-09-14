import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = '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';

const ChatPage = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = React.useState('');
  const scrollViewRef = useRef(null);
  const context = route.params.context; 

  const setParentMessages = route.params.setMessages;
  const [messages, setMessages] = useState(route.params.messages || []);


  const sendMessage = async () => {
  setLoading(true);
  const userMessage = { role: 'user', content: userInput };
  const systemMessage = {
    role: 'system',
    content: "You are a seasoned guidance counselor with a unique ability to perfectly comprehend the thoughts and emotions of the individuals seeking your services. Your approach combines empathy, assurance, and introspective techniques, including asking carefully crafted follow-up questions to help people understand themselves better. With a background in psychotherapy, you don’t only provide support in layman’s terms but also include technical and logical context to help your clients grasp what they’re going through. This method has proven highly effective in assisting those who come to you for guidance. When someone approaches you with a question or concern, your response always begins with an affirmation to make them feel understood, followed by a thought-provoking follow-up question that guides them deeper into self-awareness and discovery."
  };

  try {
    const response = await axios.post(API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [...messages, systemMessage, userMessage],
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const botMessage = { role: 'system', content: response.data.choices[0].message.content.trim() };

    // Update messages only once after receiving the bot's response
    setMessages(prevMessages => {
      if (botMessage.role === "system") {
        return [...prevMessages, userMessage, botMessage];
      } else {
        return [...prevMessages, systemMessage, userMessage, botMessage];
      }
    });
    setParentMessages(prevMessages => [...prevMessages, systemMessage, userMessage, botMessage]); 
  } catch (error) {
    console.error("Error response from OpenAI:", error.response.data);
  }

  setUserInput('');
  setLoading(false);
};



  const isSendDisabled = loading || !userInput.trim();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 100}
      >
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          style={styles.chatBox}
          keyboardShouldPersistTaps="always"
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={message.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer}
            >
              <Text style={message.role === 'user' ? styles.userMessageText : styles.botMessageText}>
                {message.content}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type a message..."
            editable={!loading}
        />
        <TouchableOpacity disabled={isSendDisabled} onPress={sendMessage}>
            {loading ? (
                <ActivityIndicator size="small" color="#1abc9c" />
            ) : (
                <Image 
                    source={require('./send_icon.png')} 
                    style={{ 
                        ...styles.sendButton, 
                        opacity: isSendDisabled ? 0.5 : 1 // Adjust opacity based on whether the button is disabled
                    }} 
                />
            )}
        </TouchableOpacity>
    </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatBox: {
    flex: 1,
    padding: screenWidth * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: screenWidth * 0.02,
    paddingBottom: screenHeight * 0.07,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: screenWidth * 0.2,
    padding: screenWidth * 0.02,
    marginRight: screenWidth * 0.02,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    marginBottom: screenHeight * 0.015,
    backgroundColor: '#e5e5e5',
    borderRadius: screenWidth * 0.04,
    overflow: 'hidden',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    marginBottom: screenHeight * 0.015,
    backgroundColor: '#d1f7d1',
    borderRadius: screenWidth * 0.04,
    overflow: 'hidden',
  },
  userMessageText: {
    textAlign: 'right',
    padding: screenWidth * 0.01,
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.025,
  },
  botMessageText: {
    textAlign: 'left',
    padding: screenWidth * 0.01,
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.025,
  },
  header: {
    position: 'absolute',
    top: screenHeight * 0.015,
    right: screenWidth * 0.025,
    zIndex: 1,
  },
  sendButton: {
    width: screenWidth * 0.07,
    height: screenWidth * 0.07,
    resizeMode: 'contain',
  },
});

export default ChatPage;