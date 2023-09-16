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
  const [situation, setSituation] = useState('');
  const [involved, setInvolved] = useState('');
  const [documents, setDocuments] = useState('');
  const [expectations, setExpectations] = useState('');

  const handleSubmit = () => {
    navigation.navigate('ChatPage', { 
      situation, 
      involved, 
      documents, 
      expectations 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Situation:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        value={situation}
        onChangeText={setSituation}
        placeholder="Can you briefly describe the situation? What is its current status and how has it developed?"
      />

      <Text style={styles.label}>Parties Involved:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        value={involved}
        onChangeText={setInvolved}
        placeholder="Who are the parties involved in this situation? Are there any potential witnesses?"
      />

      <Text style={styles.label}>Available Documents:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        value={documents}
        onChangeText={setDocuments}
        placeholder="What legal documents do you have related to this situation? Can you briefly describe their contents?"
      />

      <Text style={styles.label}>Expectation:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        value={expectations}
        onChangeText={setExpectations}
        placeholder="What do you hope to get out of this consultation?"
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
    padding: screenHeight * 0.01,
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
    height: screenHeight * 0.10,
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
    backgroundColor: '#8e44ad',
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