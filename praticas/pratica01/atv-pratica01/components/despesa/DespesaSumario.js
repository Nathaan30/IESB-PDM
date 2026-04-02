import { View, Text, StyleSheet } from "react-native";

function DespesaSumario({ despesas, periodo }) {
  const somaDespesas = despesas.reduce((total, despesa) => {
    return total + despesa.valor;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.periodo}>{periodo}</Text>
      <Text style={styles.soma}>R$ {somaDespesas.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: 'darkgray', 
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  periodo: {
    fontSize: 12,
    color: '#fff', 
  },
  soma: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DespesaSumario;