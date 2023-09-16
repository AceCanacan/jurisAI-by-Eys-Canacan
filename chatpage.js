import React, { useState, useRef,useEffect } from 'react';
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

  const { situation, involved, documents, expectations } = route.params;


  const setParentMessages = route.params.setMessages;
  const [messages, setMessages] = useState(route.params.messages || []);

  
  const sendBotMessage = (content) => {
    const botMessage = { role: 'assistant', content: content };
    setMessages(prevMessages => [...prevMessages, botMessage]);
  };

  const sendMessage = async () => {
  setLoading(true);
  const userMessage = { role: 'user', content: userInput };
  const systemMessage = {
    role: 'assistant',
    content: `Situation: ${situation}. involved: ${involved} documents: ${documents} expectations: ${expectations}}
    ChatGPT, you are an empathetic legal consultant in the Philippines so focus on Philippine Laws. Your primary role is to gain a deeper understanding of the client's situation by asking relevant questions. Your objective is not to provide advice or definitive information but to probe the circumstances and gather more details about the issue at hand.
    Ensure you build a complete picture by clarifying any ambiguities or uncertainties in the client's responses. 
    Ask about the current status of the issue, the factors that led to the present situation, the client's thoughts and feelings, and any additional information that might be relevant to the case.
    However, remember to respect the client's comfort and time, evaluate whether you've obtained sufficient information to understand the situation.
    When the conversation has become extensive or you believe you've collected enough details, kindly ask the client if they have anything more they'd like to discuss or clarify. 
    I highly emphasize that you are not here to provide any legal advice to the client, you are just there to ask questions to get details about their situation.

    CHAT GPT IT IS IMPERATIVE THAT YOU DO NOT GIVE MORE THAN ONE QUESTION PER ANSWER OR MESSAGE YOU SEND.
    DO NOT OVERWHELM THE CLIENT BY PROVIDING A BARRAGE OF QUESTIONS
    ASK ONE QUESTION AT A TIME
    `,
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

useEffect(() => {
  sendBotMessage("Hello! How can I assist you with your legal inquiries today?");
}, []);

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
                <ActivityIndicator size="small" color="#a29bfe" />
            ) : (
                <Image 
                    source={require('./send_icon.png')} 
                    style={{ 
                      ...styles.sendButton, 
                      tintColor: isSendDisabled ? 'gray' : '#6c5ce7',
                      opacity: isSendDisabled ? 0.5 : 1 
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
    backgroundColor: '#D6A2E8',
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