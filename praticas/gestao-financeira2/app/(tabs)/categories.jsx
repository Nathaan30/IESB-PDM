import { Picker } from "@react-native-picker/picker";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Button from "../../components/Button";
import { BATMAN } from "../../constants/batmanTheme";
import { MoneyContext } from "../../contexts/GlobalState";

function normalizeName(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const iconOptions = [
  "category",
  "favorite",
  "sports-esports",
  "shopping-cart",
  "local-hospital",
  "directions-car",
  "school",
  "home",
  "fastfood",
  "flight",
  "work",
  "attach-money",
];

const colorOptions = [
  "#F7C948",
  "#FFB6B6",
  "#82C9DE",
  "#AB8FBE",
  "#DEA17B",
  "#E6E088",
  "#58D68D",
  "#FF6B6B",
];

export default function Categories() {
  const {
    categories,
    loading,
    error,
    refresh,
    addCategory,
    removeCategory,
  } = useContext(MoneyContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    icon: "category",
    background: "#F7C948",
    isIncome: false,
  });

  function closeModal() {
    setModalVisible(false);
    setForm({
      displayName: "",
      icon: "category",
      background: "#F7C948",
      isIncome: false,
    });
  }

  async function handleCreateCategory() {
    if (saving) return;

    if (!form.displayName.trim()) {
      Alert.alert("Erro", "Informe o nome da categoria.");
      return;
    }

    const name = normalizeName(form.displayName);

    try {
      setSaving(true);

      await addCategory({
        name,
        displayName: form.displayName.trim(),
        icon: form.icon,
        background: form.background,
        isIncome: form.isIncome,
      });

      closeModal();

      Alert.alert("Sucesso!", "Categoria criada com sucesso.");
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Erro",
        "Não foi possível criar a categoria. Talvez já exista uma com esse nome."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(category) {
    if (category.isDefault) {
      Alert.alert("Aviso", "Categorias padrão não podem ser excluídas.");
      return;
    }

    try {
      await removeCategory(category.id);
      Alert.alert("Sucesso!", "Categoria excluída com sucesso.");
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Erro",
        "Não foi possível excluir. Verifique se existem transações usando essa categoria."
      );
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
    <View style={styles.screen}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <Text style={styles.heroMini}>GOTHAM CATEGORIES</Text>
              <Text style={styles.heroTitle}>Categorias</Text>
              <Text style={styles.heroSubtitle}>
                Crie categorias customizadas para suas receitas e despesas.
              </Text>
            </View>

            <Button onPress={() => setModalVisible(true)}>
              Nova categoria
            </Button>

            <Text style={styles.sectionTitle}>Categorias cadastradas</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: item.background || BATMAN.yellow },
              ]}
            >
              <MaterialIcons
                name={item.icon || "category"}
                size={24}
                color={BATMAN.background}
              />
            </View>

            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{item.displayName}</Text>

              <Text style={styles.categoryType}>
                {item.isIncome ? "Receita" : "Despesa"}{" "}
                {item.isDefault ? "• Padrão" : "• Customizada"}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                item.isDefault && styles.disabledDeleteButton,
              ]}
              onPress={() => handleDeleteCategory(item)}
            >
              <MaterialIcons
                name="delete"
                size={22}
                color={item.isDefault ? BATMAN.textSecondary : BATMAN.red}
              />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova categoria</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              value={form.displayName}
              onChangeText={(text) =>
                setForm({ ...form, displayName: text })
              }
              placeholder="Ex: Saúde"
              placeholderTextColor={BATMAN.textSecondary}
              style={styles.input}
            />

            <Text style={styles.label}>Tipo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.isIncome ? "income" : "expense"}
                onValueChange={(value) =>
                  setForm({ ...form, isIncome: value === "income" })
                }
                style={styles.picker}
              >
                <Picker.Item label="Despesa" value="expense" />
                <Picker.Item label="Receita" value="income" />
              </Picker>
            </View>

            <Text style={styles.label}>Ícone</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.icon}
                onValueChange={(value) => setForm({ ...form, icon: value })}
                style={styles.picker}
              >
                {iconOptions.map((icon) => (
                  <Picker.Item key={icon} label={icon} value={icon} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Cor</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    form.background === color && styles.selectedColor,
                  ]}
                  onPress={() => setForm({ ...form, background: color })}
                />
              ))}
            </View>

            <Button onPress={handleCreateCategory}>
              {saving ? "Salvando..." : "Criar categoria"}
            </Button>

            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  sectionTitle: {
    fontSize: 19,
    color: BATMAN.yellow,
    fontWeight: "900",
    marginTop: 22,
    marginBottom: 12,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BATMAN.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BATMAN.border,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    color: BATMAN.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  categoryType: {
    color: BATMAN.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2A1618",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledDeleteButton: {
    backgroundColor: BATMAN.surface2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: BATMAN.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: BATMAN.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: BATMAN.border,
  },
  modalTitle: {
    color: BATMAN.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    color: BATMAN.yellow,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderColor: BATMAN.border,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: BATMAN.surface2,
    color: BATMAN.textPrimary,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  pickerContainer: {
    height: 46,
    borderColor: BATMAN.border,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: BATMAN.surface2,
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 12,
  },
  picker: {
    color: BATMAN.textPrimary,
    backgroundColor: BATMAN.surface2,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  colorOption: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: BATMAN.border,
  },
  selectedColor: {
    borderColor: BATMAN.white,
    transform: [{ scale: 1.1 }],
  },
  cancelButton: {
    height: 46,
    borderRadius: 14,
    backgroundColor: BATMAN.surface2,
    borderWidth: 1,
    borderColor: BATMAN.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: BATMAN.textPrimary,
    fontWeight: "900",
  },
});