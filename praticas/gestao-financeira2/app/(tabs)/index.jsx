import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useContext, useMemo, useState } from "react";
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

import TransactionItem from "../../components/TransactionItem";
import { BATMAN } from "../../constants/batmanTheme";
import { MoneyContext } from "../../contexts/GlobalState";

const months = [
  { label: "Todos os meses", value: 0 },
  { label: "Janeiro", value: 1 },
  { label: "Fevereiro", value: 2 },
  { label: "Março", value: 3 },
  { label: "Abril", value: 4 },
  { label: "Maio", value: 5 },
  { label: "Junho", value: 6 },
  { label: "Julho", value: 7 },
  { label: "Agosto", value: 8 },
  { label: "Setembro", value: 9 },
  { label: "Outubro", value: 10 },
  { label: "Novembro", value: 11 },
  { label: "Dezembro", value: 12 },
];

function getDateParts(dateString) {
  const dateOnly = dateString?.slice(0, 10);

  if (!dateOnly) {
    return { year: null, month: null, day: null };
  }

  const [year, month, day] = dateOnly.split("-").map(Number);

  return { year, month, day };
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parseMoneyValue(value) {
  if (!value) return 0;

  const normalizedValue = String(value)
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const numberValue = Number(normalizedValue);

  return Number.isNaN(numberValue) ? 0 : numberValue;
}

function formatDateForInput(dateString) {
  return dateString?.slice(0, 10) ?? "";
}

export default function Transactions() {
  const {
    transactions,
    categories,
    loading,
    error,
    refresh,
    removeTransaction,
    updateTransaction,
    user,
  } = useContext(MoneyContext);

  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    description: "",
    value: "",
    date: "",
    categoryId: "",
  });

  const years = useMemo(() => {
    const transactionYears = transactions
      .map((transaction) => getDateParts(transaction.date).year)
      .filter(Boolean);

    const uniqueYears = new Set([
      currentYear,
      currentYear - 1,
      currentYear + 1,
      ...transactionYears,
    ]);

    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [transactions, currentYear]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const { year, month } = getDateParts(transaction.date);

      const matchesYear = year === selectedYear;
      const matchesMonth = selectedMonth === 0 || month === selectedMonth;

      return matchesYear && matchesMonth;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const value = Number(transaction.value);

        if (transaction.category?.isIncome) {
          acc.income += value;
        } else {
          acc.expenses += value;
        }

        acc.balance = acc.income - acc.expenses;

        return acc;
      },
      {
        income: 0,
        expenses: 0,
        balance: 0,
      }
    );
  }, [filteredTransactions]);

  function openOptionsModal(transaction) {
    setSelectedTransaction(transaction);
    setOptionsModalVisible(true);
  }

  function closeOptionsModal() {
    setOptionsModalVisible(false);
  }

  function closeEditModal() {
    setEditModalVisible(false);
    setSelectedTransaction(null);
    setEditForm({
      description: "",
      value: "",
      date: "",
      categoryId: "",
    });
  }

  function openEditModal() {
    if (!selectedTransaction) return;

    setEditForm({
      description: selectedTransaction.description,
      value: String(selectedTransaction.value).replace(".", ","),
      date: formatDateForInput(selectedTransaction.date),
      categoryId: selectedTransaction.categoryId,
    });

    setOptionsModalVisible(false);
    setEditModalVisible(true);
  }

  async function handleDeleteTransaction() {
    if (!selectedTransaction) return;

    try {
      await removeTransaction(selectedTransaction.id);

      setOptionsModalVisible(false);
      setSelectedTransaction(null);

      Alert.alert("Sucesso!", "Transação excluída com sucesso.");
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível excluir a transação.");
    }
  }

  async function handleSaveEdit() {
    if (!selectedTransaction || savingEdit) return;

    const numericValue = parseMoneyValue(editForm.value);

    if (!editForm.description.trim()) {
      Alert.alert("Erro", "Informe uma descrição.");
      return;
    }

    if (!numericValue || numericValue <= 0) {
      Alert.alert("Erro", "Informe um valor maior que zero.");
      return;
    }

    if (!editForm.date.trim()) {
      Alert.alert("Erro", "Informe uma data.");
      return;
    }

    if (!editForm.categoryId) {
      Alert.alert("Erro", "Selecione uma categoria.");
      return;
    }

    try {
      setSavingEdit(true);

      await updateTransaction(selectedTransaction.id, {
        description: editForm.description.trim(),
        value: numericValue,
        date: editForm.date,
        categoryId: editForm.categoryId,
      });

      closeEditModal();

      Alert.alert("Sucesso!", "Transação editada com sucesso.");
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível editar a transação.");
    } finally {
      setSavingEdit(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={BATMAN.yellow} />
        <Text style={styles.loadingText}>
          Carregando a Batcaverna financeira...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <View style={styles.heroTop}>
                <View style={styles.heroTextBox}>
                  <Text style={styles.heroMini}>GOTHAM FINANCE</Text>
                  <Text style={styles.heroTitle}>
                    Bem-vindo{user?.name ? `, ${user.name}` : ""}.
                  </Text>
                  <Text style={styles.heroSubtitle}>
                    Controle total das suas finanças.
                  </Text>
                </View>

                <View style={styles.batBadge}>
                  <MaterialIcons
                    name="dark-mode"
                    size={24}
                    color={BATMAN.background}
                  />
                </View>
              </View>

              <View style={styles.balanceHeroBox}>
                <Text style={styles.balanceHeroLabel}>Saldo do período</Text>
                <Text
                  style={[
                    styles.balanceHeroValue,
                    { color: totals.balance >= 0 ? BATMAN.green : BATMAN.red },
                  ]}
                >
                  {formatCurrency(totals.balance)}
                </Text>
              </View>
            </View>

            <View style={styles.cardsRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Receitas</Text>
                <Text style={[styles.summaryValue, { color: BATMAN.green }]}>
                  {formatCurrency(totals.income)}
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Despesas</Text>
                <Text style={[styles.summaryValue, { color: BATMAN.red }]}>
                  {formatCurrency(totals.expenses)}
                </Text>
              </View>
            </View>

            <View style={styles.filtersContainer}>
              <View style={styles.filtersHeader}>
                <Text style={styles.sectionTitle}>Filtros</Text>

                <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
                  <MaterialIcons
                    name="refresh"
                    size={18}
                    color={BATMAN.background}
                  />
                  <Text style={styles.refreshButtonText}>Atualizar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filters}>
                <View style={styles.filterField}>
                  <Text style={styles.filterLabel}>Mês</Text>

                  <View style={styles.picker}>
                    <Picker
                      selectedValue={selectedMonth}
                      onValueChange={setSelectedMonth}
                      style={styles.pickerText}
                    >
                      {months.map((month) => (
                        <Picker.Item
                          key={month.value}
                          label={month.label}
                          value={month.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.filterField}>
                  <Text style={styles.filterLabel}>Ano</Text>

                  <View style={styles.picker}>
                    <Picker
                      selectedValue={selectedYear}
                      onValueChange={setSelectedYear}
                      style={styles.pickerText}
                    >
                      {years.map((year) => (
                        <Picker.Item
                          key={year}
                          label={String(year)}
                          value={year}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Transações</Text>
            <Text style={styles.hintText}>
              Segure uma transação para editar ou excluir.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onLongPress={() => openOptionsModal(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="shield" size={42} color={BATMAN.yellow} />
            <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptyText}>
              Altere os filtros ou adicione novas movimentações.
            </Text>
          </View>
        }
      />

      <Modal
        visible={optionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeOptionsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <MaterialIcons
                name="dark-mode"
                size={26}
                color={BATMAN.background}
              />
            </View>

            <Text style={styles.modalTitle}>Painel da transação</Text>

            <Text style={styles.modalDescription}>
              {selectedTransaction?.description}
            </Text>

            <TouchableOpacity style={styles.modalButton} onPress={openEditModal}>
              <Text style={styles.modalButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDeleteTransaction}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={closeOptionsModal}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.modalTitle}>Editar transação</Text>

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              value={editForm.description}
              onChangeText={(text) =>
                setEditForm({ ...editForm, description: text })
              }
              placeholder="Descrição"
              placeholderTextColor={BATMAN.textSecondary}
              style={styles.input}
            />

            <Text style={styles.label}>Valor</Text>
            <TextInput
              value={editForm.value}
              onChangeText={(text) => setEditForm({ ...editForm, value: text })}
              placeholder="Ex: 2500,50"
              placeholderTextColor={BATMAN.textSecondary}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.label}>Data</Text>
            <TextInput
              value={editForm.date}
              onChangeText={(text) => setEditForm({ ...editForm, date: text })}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={BATMAN.textSecondary}
              style={styles.input}
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.editPicker}>
              <Picker
                selectedValue={editForm.categoryId}
                onValueChange={(itemValue) =>
                  setEditForm({ ...editForm, categoryId: itemValue })
                }
                style={styles.pickerText}
              >
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.displayName}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleSaveEdit}>
              <Text style={styles.modalButtonText}>
                {savingEdit ? "Salvando..." : "Salvar alterações"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={closeEditModal}
            >
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
  list: {
    flex: 1,
    backgroundColor: BATMAN.background,
  },
  listContent: {
    padding: 18,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BATMAN.background,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: BATMAN.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: BATMAN.red,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: BATMAN.yellow,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: BATMAN.background,
    fontWeight: "900",
  },
  heroCard: {
    backgroundColor: BATMAN.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: BATMAN.border,
    marginBottom: 16,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  heroTextBox: {
    flex: 1,
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
    fontSize: 24,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: BATMAN.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  batBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: BATMAN.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceHeroBox: {
    backgroundColor: BATMAN.surface2,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BATMAN.border,
  },
  balanceHeroLabel: {
    color: BATMAN.textSecondary,
    fontSize: 13,
    marginBottom: 6,
  },
  balanceHeroValue: {
    fontSize: 26,
    fontWeight: "900",
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: BATMAN.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BATMAN.border,
  },
  summaryLabel: {
    fontSize: 13,
    color: BATMAN.textSecondary,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: "900",
  },
  filtersContainer: {
    backgroundColor: BATMAN.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: BATMAN.border,
    marginBottom: 18,
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: BATMAN.yellow,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  refreshButtonText: {
    color: BATMAN.background,
    fontWeight: "900",
    fontSize: 13,
  },
  filters: {
    flexDirection: "row",
    gap: 12,
  },
  filterField: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    color: BATMAN.textPrimary,
    fontWeight: "800",
    marginBottom: 6,
  },
  picker: {
    height: 44,
    borderColor: BATMAN.border,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: BATMAN.surface2,
    justifyContent: "center",
    overflow: "hidden",
  },
  pickerText: {
    color: BATMAN.textPrimary,
    backgroundColor: BATMAN.surface2,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: BATMAN.yellow,
    marginBottom: 4,
  },
  hintText: {
    fontSize: 12,
    color: BATMAN.textSecondary,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BATMAN.surface,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: BATMAN.border,
    marginTop: 6,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: BATMAN.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: BATMAN.textSecondary,
    textAlign: "center",
    lineHeight: 20,
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
    maxWidth: 420,
    backgroundColor: BATMAN.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: BATMAN.border,
  },
  editModalContent: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: BATMAN.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: BATMAN.border,
    gap: 10,
  },
  modalIcon: {
    alignSelf: "center",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: BATMAN.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: BATMAN.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: BATMAN.textSecondary,
    marginBottom: 18,
    textAlign: "center",
  },
  modalButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: BATMAN.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: BATMAN.background,
    fontWeight: "900",
  },
  deleteButton: {
    backgroundColor: "#2A1618",
    borderWidth: 1,
    borderColor: "#5C2B30",
  },
  deleteButtonText: {
    color: BATMAN.red,
    fontWeight: "900",
  },
  cancelButton: {
    backgroundColor: BATMAN.surface2,
    borderWidth: 1,
    borderColor: BATMAN.border,
  },
  cancelButtonText: {
    color: BATMAN.textPrimary,
    fontWeight: "900",
  },
  label: {
    color: BATMAN.yellow,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
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
    marginBottom: 6,
  },
  editPicker: {
    height: 46,
    borderColor: BATMAN.border,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: BATMAN.surface2,
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 12,
  },
});