import { Text, View, ScrollView, TextInput, Alert, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useState, useContext } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { globalStyles } from "../../styles/globalStyles";
import { categories } from "../../constants/categories";
import { colors } from "../../constants/colors";
import Button from "../../components/Button";
import { MoneyContext } from "../../contexts/GlobalState";

export default function AddTransactions() {
  const initialForm = {
    description: "",
    value: 0,
    date: new Date(),
    category: "Renda",
  };

  const [form, setForm] = useState(initialForm);
  const [showPicker, setShowPicker] = useState(false);
  
  const [transactions, setTransactions] = useContext(MoneyContext);

  const setAsyncStorage = async (data) => {
    try {
      await AsyncStorage.setItem("transactions", JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  };

  const addTransaction = async () => {
    if (!form.description || form.value === 0) {
      Alert.alert("Erro", "Preencha a descrição e o valor.");
      return;
    }

    const newTransaction = { id: transactions.length + 1, ...form };
    const updatedTransactions = [...transactions, newTransaction];

    setTransactions(updatedTransactions); 
    setForm(initialForm);
    await setAsyncStorage(updatedTransactions); 

    Alert.alert("Sucesso!", "Transação adicionada e salva!");
  };

  const handleCurrencyChange = (text) => {
    const formattedValue = text.replace(/\D/g, "");
    const numberValue = formattedValue ? parseFloat(formattedValue) / 100 : 0;
    setForm({ ...form, value: numberValue });
  };

  const handleDateChange = (_, selectDate) => {
    setShowPicker(false);
    if (selectDate) {
      setForm({ ...form, date: selectDate });
    }
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView contentContainerStyle={globalStyles.content}>
        <View style={styles.form}>
          <View>
            <Text style={globalStyles.inputLabel}>Descrição</Text>
            <TextInput
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              style={globalStyles.input}
              placeholder="Ex: Aluguel"
            />
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Valor</Text>
            <TextInput
              value={form.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              onChangeText={handleCurrencyChange}
              keyboardType="numeric"
              style={globalStyles.input}
            />
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Data</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <TextInput
                value={form.date.toLocaleDateString("pt-BR")}
                style={globalStyles.input}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>

            {showPicker && (
              <RNDateTimePicker
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                value={form.date}
                onChange={handleDateChange}
              />
            )}
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Categoria</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={form.category}
                onValueChange={(itemValue) => setForm({ ...form, category: itemValue })}
              >
                <Picker.Item label={categories.income.displayName} value={categories.income.name} />
                <Picker.Item label={categories.food.displayName} value={categories.food.name} />
                <Picker.Item label={categories.house.displayName} value={categories.house.name} />
                <Picker.Item label={categories.education.displayName} value={categories.education.name} />
                <Picker.Item label={categories.travel.displayName} value={categories.travel.name} />
              </Picker>
            </View>
          </View>
        </View>

        <Button onPress={addTransaction}>Adicionar</Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12, marginBottom: 40, marginTop: 10 },
  picker: {
    display: "flex", justifyContent: "center", height: 44,
    borderColor: colors.secondaryText, borderWidth: 1, borderRadius: 8,
    backgroundColor: colors.primaryContrast, flexGrow: 1,
  },
});