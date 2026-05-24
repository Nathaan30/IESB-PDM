import { Picker } from "@react-native-picker/picker";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Button from "../../components/Button";
import { BATMAN } from "../../constants/batmanTheme";
import { MoneyContext } from "../../contexts/GlobalState";

function getTodayDateString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createInitialForm(categoryId = "") {
  return {
    description: "",
    value: "",
    date: getTodayDateString(),
    categoryId,
  };
}

function parseMoneyValue(value) {
  if (!value) return 0;

  const normalizedValue = value
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const numberValue = Number(normalizedValue);

  return Number.isNaN(numberValue) ? 0 : numberValue;
}

export default function AddTransactions() {
  const { categories, loading, error, refresh, addTransaction } =
    useContext(MoneyContext);

  const [form, setForm] = useState(createInitialForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!form.categoryId && categories.length > 0) {
      const incomeCategory = categories.find((category) => category.isIncome);
      const defaultCategory = incomeCategory ?? categories[0];

      setForm((currentForm) => ({
        ...currentForm,
        categoryId: defaultCategory.id,
      }));
    }
  }, [categories, form.categoryId]);

  async function handleAddTransaction() {
    if (saving) return;

    const numericValue = parseMoneyValue(form.value);

    if (!form.description.trim()) {
      Alert.alert("Erro", "Informe uma descrição.");
      return;
    }

    if (!numericValue || numericValue <= 0) {
      Alert.alert("Erro", "Informe um valor maior que zero.");
      return;
    }

    if (!form.date.trim()) {
      Alert.alert("Erro", "Informe uma data.");
      return;
    }

    if (!form.categoryId) {
      Alert.alert("Erro", "Selecione uma categoria.");
      return;
    }

    try {
      setSaving(true);

      await addTransaction({
        description: form.description.trim(),
        value: numericValue,
        date: form.date,
        categoryId: form.categoryId,
      });

      setForm(createInitialForm(form.categoryId));

      Alert.alert("Sucesso!", "Transação adicionada com sucesso!");
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível adicionar a transação.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={BATMAN.yellow} />
        <Text style={styles.loadingText}>Carregando categorias...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Erro ao carregar dados</Text>
        <Text style={styles.errorText}>{error}</Text>

        <Button onPress={refresh}>Tentar novamente</Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroMini}>GOTHAM REGISTER</Text>
          <Text style={styles.heroTitle}>Nova transação</Text>
          <Text style={styles.heroSubtitle}>
            Cadastre receitas e despesas direto no banco de dados.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View>
            <Text style={styles.label}>Descrição</Text>

            <TextInput
              value={form.description}
              onChangeText={(text) =>
                setForm({ ...form, description: text })
              }
              placeholder="Ex: Salário, mercado, lanche..."
              placeholderTextColor={BATMAN.textSecondary}
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>Valor</Text>

            <TextInput
              value={form.value}
              onChangeText={(text) => setForm({ ...form, value: text })}
              placeholder="Ex: 2500,50"
              placeholderTextColor={BATMAN.textSecondary}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.helperText}>
              Use vírgula ou ponto para centavos. Ex: 3500,50
            </Text>
          </View>

          <View>
            <Text style={styles.label}>Data</Text>

            <TextInput
              value={form.date}
              onChangeText={(text) => setForm({ ...form, date: text })}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={BATMAN.textSecondary}
              style={styles.input}
            />

            <Text style={styles.helperText}>Formato: 2026-04-29</Text>
          </View>

          <View>
            <Text style={styles.label}>Categoria</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.categoryId}
                onValueChange={(itemValue) =>
                  setForm({ ...form, categoryId: itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="Selecione uma categoria" value="" />

                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.displayName}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <Button onPress={handleAddTransaction}>
          {saving ? "Salvando..." : "Adicionar transação"}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BATMAN.background,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: BATMAN.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: BATMAN.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  errorTitle: {
    color: BATMAN.yellow,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  errorText: {
    color: BATMAN.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
  },
  heroCard: {
    backgroundColor: BATMAN.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: BATMAN.border,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  heroMini: {
    color: BATMAN.yellow,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroTitle: {
    color: BATMAN.textPrimary,
    fontSize: 26,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: BATMAN.textSecondary,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: BATMAN.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: BATMAN.border,
    marginBottom: 18,
    gap: 16,
  },
  label: {
    color: BATMAN.yellow,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    height: 48,
    borderColor: BATMAN.border,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: BATMAN.surface2,
    color: BATMAN.textPrimary,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "600",
  },
  helperText: {
    color: BATMAN.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },
  pickerContainer: {
    height: 48,
    borderColor: BATMAN.border,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: BATMAN.surface2,
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    color: BATMAN.textPrimary,
    backgroundColor: BATMAN.surface2,
  },
});