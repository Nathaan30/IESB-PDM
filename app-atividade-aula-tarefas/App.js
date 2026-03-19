import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import { useState } from 'react';
import { rotulo_btn_cadastro_meta, rotulo_lista_metas, rotulo_input_meta } from './mensagens';
import MetasList from './components/MetasList';

export default function App() {

  const [inputMetaText, setInputMetaText] = useState('');
  const [metas, setMetas] = useState([]);

  function metaInputHandler(inputText) {
    setInputMetaText(inputText);
  }

  function adicionarMetaHandler() {
    setMetas([...metas, inputMetaText]);
  }

  return (
    <View style={styles.mainContainer}>
      
      
      <View style={styles.inputContainer}>
        <View style={{ width:'65%' }}>
          <TextInput 
            style={styles.inputText}
            placeholder={rotulo_input_meta}
            value={inputMetaText}
             onChangeText={metaInputHandler}
          />
        </View>
        <View style={{ width:'30%' }}>
          <Button 
            title={rotulo_btn_cadastro_meta}
            onPress={adicionarMetaHandler}
          />
        </View>
      </View>
      
      <View style={styles.metaContainer}>
          <MetasList array={metas} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    padding: 30, 
    flexDirection: 'column',
    flex: 1,
  },
  
  inputContainer: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1, 
    borderBottomColor: '#cccccc' 
  },
  
  inputText: {
    borderColor: '#cccccc',
    borderWidth: 1,
  },
  metaContainer: {
    flex: 15, 
  },
  tituloLista: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    margin: 8, 
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'skyblue', 
  }
});