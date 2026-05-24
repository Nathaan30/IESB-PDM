import { Picker } from "@react-native-picker/picker";
import { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { MaterialIcons } from "@expo/vector-icons";

import SummaryItem from "../../components/SummaryItem";
import { BATMAN } from "../../constants/batmanTheme";
import { MoneyContext } from "../../contexts/GlobalState";

const months = [
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
    return {
      year: null,
      month: null,
      day: null,
    };
  }

  const [year, month, day] = dateOnly.split("-").map(Number);

  return {
    year,
    month,
    day,
  };
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Summary() {
  const { transactions, categories, loading, error, refresh } =
    useContext(MoneyContext);

  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = Math.min(screenWidth - 36, 720);

  const years = useMemo(() => {
    const transactionYears = transactions
      .map((transaction) => getDateParts(transaction.date).year)
      .filter(Boolean);

    const uniqueYears = new Set([
      today.getFullYear(),
      today.getFullYear() - 1,
      today.getFullYear() + 1,
      ...transactionYears,
    ]);

    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const { year, month } = getDateParts(transaction.date);

      return year === selectedYear && month === selectedMonth;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const summary = useMemo(() => {
    const totalsByCategory = {};

    categories.forEach((category) => {
      totalsByCategory[category.id] = {
        ...category,
        total: 0,
      };
    });

    let income = 0;
    let expenses = 0;

    filteredTransactions.forEach((transaction) => {
      const value = Number(transaction.value);

      const category =
        transaction.category ??
        categories.find((item) => item.id === transaction.categoryId);

      if (!category) {
        return;
      }

      if (!totalsByCategory[category.id]) {
        totalsByCategory[category.id] = {
          ...category,
          total: 0,
        };
      }

      totalsByCategory[category.id].total += value;

      if (category.isIncome) {
        income += value;
      } else {
        expenses += value;
      }
    });

    return {
      totals: Object.values(totalsByCategory),
      income,
      expenses,
      balance: income - expenses,
    };
  }, [categories, filteredTransactions]);

  const chartData = useMemo(() => {
    return summary.totals
      .filter((category) => !category.isIncome && category.total > 0)
      .map((category) => ({
        name: category.displayName,
        population: category.total,
        color: category.background || BATMAN.yellow,
        legendFontColor: BATMAN.textPrimary,
        legendFontSize: 12,
      }));
  }, [summary.totals]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={BATMAN.yellow} />
        <Text style={styles.loadingText}>Carregando resumo financeiro...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Erro ao carregar dados</Text>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroTextBox}>
              <Text style={styles.heroMini}>GOTHAM SUMMARY</Text>
              <Text style={styles.heroTitle}>Resumo financeiro</Text>
              <Text style={styles.heroSubtitle}>
                Analise receitas, despesas e categorias do período.
              </Text>
            </View>

            <View style={styles.heroIcon}>
              <MaterialIcons
                name="pie-chart"
                size={26}
                color={BATMAN.background}
              />
            </View>
          </View>
        </View>

        <View style={styles.filtersCard}>
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
            <View style={styles.field}>
              <Text style={styles.label}>Mês</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={setSelectedMonth}
                  style={styles.picker}
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

            <View style={styles.field}>
              <Text style={styles.label}>Ano</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={setSelectedYear}
                  style={styles.picker}
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

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo do período</Text>

          <Text
            style={[
              styles.balanceValue,
              {
                color: summary.balance >= 0 ? BATMAN.green : BATMAN.red,
              },
            ]}
          >
            {formatCurrency(summary.balance)}
          </Text>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.totalCard}>
            <View style={styles.totalIconGreen}>
              <MaterialIcons
                name="trending-up"
                size={22}
                color={BATMAN.background}
              />
            </View>

            <Text style={styles.totalLabel}>Receitas</Text>

            <Text style={[styles.totalValue, { color: BATMAN.green }]}>
              {formatCurrency(summary.income)}
            </Text>
          </View>

          <View style={styles.totalCard}>
            <View style={styles.totalIconRed}>
              <MaterialIcons
                name="trending-down"
                size={22}
                color={BATMAN.background}
              />
            </View>

            <Text style={styles.totalLabel}>Despesas</Text>

            <Text style={[styles.totalValue, { color: BATMAN.red }]}>
              {formatCurrency(summary.expenses)}
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Despesas por categoria</Text>
            <MaterialIcons name="donut-large" size={24} color={BATMAN.yellow} />
          </View>

          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={chartWidth}
              height={220}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="12"
              absolute
              chartConfig={{
                color: () => BATMAN.textPrimary,
                labelColor: () => BATMAN.textPrimary,
              }}
            />
          ) : (
            <View style={styles.emptyChart}>
              <MaterialIcons
                name="shield-moon"
                size={40}
                color={BATMAN.yellow}
              />

              <Text style={styles.emptyChartTitle}>
                Nenhuma despesa encontrada
              </Text>

              <Text style={styles.emptyChartText}>
                Cadastre uma despesa nesse mês para visualizar o gráfico.
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Resumo por categoria</Text>

        {summary.totals.map((category) => (
          <SummaryItem
            key={category.id}
            category={category}
            value={category.total}
          />
        ))}

        {summary.totals.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhuma categoria encontrada</Text>
            <Text style={styles.emptyText}>
              Verifique se a API está rodando e se as categorias foram criadas.
            </Text>
          </View>
        )}
      </ScrollView>
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
  retryButton: {
    backgroundColor: BATMAN.yellow,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
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
    fontSize: 26,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: BATMAN.textSecondary,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: BATMAN.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  filtersCard: {
    backgroundColor: BATMAN.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: BATMAN.border,
    marginBottom: 16,
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  filters: {
    flexDirection: "row",
    gap: 12,
  },
  field: {
    flex: 1,
  },
  label: {
    color: BATMAN.yellow,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 7,
  },
  pickerContainer: {
    height: 46,
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
  balanceCard: {
    backgroundColor: BATMAN.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: BATMAN.border,
    borderLeftWidth: 5,
    borderLeftColor: BATMAN.yellow,
    marginBottom: 16,
  },
  balanceLabel: {
    color: BATMAN.textSecondary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 30,
    fontWeight: "900",
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  totalCard: {
    flex: 1,
    backgroundColor: BATMAN.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: BATMAN.border,
  },
  totalIconGreen: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BATMAN.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  totalIconRed: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BATMAN.red,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  totalLabel: {
    color: BATMAN.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "900",
  },
  chartCard: {
    backgroundColor: BATMAN.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: BATMAN.border,
    marginBottom: 18,
    overflow: "hidden",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 19,
    color: BATMAN.yellow,
    fontWeight: "900",
    marginBottom: 12,
  },
  emptyChart: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 26,
  },
  emptyChartTitle: {
    color: BATMAN.textPrimary,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 6,
  },
  emptyChartText: {
    color: BATMAN.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyContainer: {
    backgroundColor: BATMAN.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: BATMAN.border,
    alignItems: "center",
  },
  emptyTitle: {
    color: BATMAN.textPrimary,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  emptyText: {
    color: BATMAN.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});