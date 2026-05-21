import { useContext } from "react";
import { FlatList, Text, View } from "react-native";
import { MoneyContext } from "../../contexts/GlobalState"; 
import TransactionItem from "../../components/TransactionItem";
import { globalStyles } from "../../styles/globalStyles";

export default function Transactions() {
  const [transactions] = useContext(MoneyContext);

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TransactionItem {...item} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={globalStyles.secondaryText}>
              Ainda não há nenhum item cadastrado!
            </Text>
          </View>
        }
        contentContainerStyle={globalStyles.content} 
      />
    </View>
  );
}