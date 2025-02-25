import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CreateQuizScreen = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const handleOptionChange = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleSubmitQuiz = () => {
    if (quizTitle && question && correctAnswer !== null) {
      const quizData = {
        title: quizTitle,
        question,
        options,
        correctAnswer,
      };
      console.log('Quiz Created:', quizData);
      alert('Quiz Created Successfully!');
    } else {
      alert('Please fill all fields!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Quiz</Text>

      <TextInput
        style={styles.input}
        placeholder="Quiz Title"
        value={quizTitle}
        onChangeText={setQuizTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Question"
        value={question}
        onChangeText={setQuestion}
      />

      {options.map((option, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Option ${index + 1}`}
          value={option}
          onChangeText={(text) => handleOptionChange(text, index)}
        />
      ))}

      <TextInput
        style={styles.input}
        placeholder="Correct Answer (Enter option number)"
        keyboardType="numeric"
        onChangeText={(text) => setCorrectAnswer(parseInt(text) - 1)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmitQuiz}>
        <Text style={styles.buttonText}>Submit Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateQuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
