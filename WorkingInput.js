import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function WorkingInput() {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText} // Updates state without unmounting the input
        placeholder="Type here..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { height: 50, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }
});

