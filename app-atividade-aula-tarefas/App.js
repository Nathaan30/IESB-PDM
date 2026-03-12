import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { rotulo_btn_cadastro_meta, rotulo_lista_metas, rotulo_input_meta } from './mensagens';

export default function App() {
  return (
    <View style={styles.mainContainer}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
      <TextInput style={styles.inputText}
        placeholder={rotulo_input_meta} />
      </View>
      <View>
        <Button title={rotulo_btn_cadastro_meta}/>
         </View>
      </View>
      <View>
        <Text>{rotulo_lista_metas}</Text>
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
    flex: 1,
    flexDirection: 'column',
  },
  inputText: {
    borderColor: '#ccccc',
    borderWidth: 1
  },
});
