import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const InputPage = ({ navigation }) => {
  const [context, setContext] = useState('');
  const [expectations, setExpectations] = useState('');

  const handleSubmit = () => {
    navigation.navigate('ChatPage', { context, expectations });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Context:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        scrollEnabled
        value={context}
        onChangeText={setContext}
        placeholder="Describe the context of your conversation."
      />
      <Text style={styles.label}>Expectations:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        scrollEnabled
        value={expectations}
        onChangeText={setExpectations}
        placeholder="What do you expect from this conversation?"
      />
      <View style={styles.centeredContainer}>
        <CustomButton
          title="SUBMIT"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center', // This centers the children horizontally
    justifyContent: 'center', // This centers the children vertically
  },
  centeredContainer: {
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  inputBox: {
    width: '100%', // Ensure it takes the full width
    height: screenHeight * 0.18,
    backgroundColor: 'white',
    borderRadius: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.01,
    fontSize: screenWidth * 0.04,
    marginBottom: screenHeight * 0.01,
    shadowColor: 'black',
    shadowOffset: { 
      width: screenWidth * 0.002, 
      height: screenHeight * 0.002 
    },
    shadowOpacity: 0.2,
    shadowRadius: screenHeight * 0.002,
    elevation: screenHeight * 0.002,
  },
  buttonContainer: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center', 
    justifyContent: 'center', 
    width: screenWidth * 0.5,
    borderRadius: screenHeight * 0.1
  },
  submitButton: {
    marginTop: 20,
    marginBottom:screenWidth * 0.05,  // Add some margin to separate from the above element
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Helvetica',
    fontWeight: 'bold'
  },
});

export default InputPage;