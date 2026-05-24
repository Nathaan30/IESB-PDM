import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BATMAN = {
  background: "#0B0B0D",
  card: "#17181C",
  cardBorder: "#2A2B31",
  textPrimary: "#F5F5F5",
  textSecondary: "#B6B7BD",
  yellow: "#F7C948",
  yellowSoft: "#FFD95A",
  green: "#58D68D",
  red: "#FF6B6B",
  white: "#FFFFFF",
};

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(dateString) {
  if (!dateString) return "";

  const dateOnly = dateString.slice(0, 10);
  const [year, month, day] = dateOnly.split("-");

  return `${day}/${month}/${year}`;
}

export default function TransactionItem({ transaction, onLongPress }) {
  const category = transaction.category;
  const isIncome = category?.isIncome;
  const value = Number(transaction.value);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onLongPress={onLongPress}
      style={styles.card}
    >
      <View style={styles.leftAccent} />

      <View
        style={[
          styles.iconContainer,
          { backgroundColor: category?.background ?? BATMAN.yellow },
        ]}
      >
        <MaterialIcons
          name={category?.icon ?? "category"}
          size={24}
          color={BATMAN.background}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.topLine}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>

          <Text
            style={[
              styles.value,
              { color: isIncome ? BATMAN.green : BATMAN.red },
            ]}
          >
            {isIncome ? "+" : "-"} {formatCurrency(value)}
          </Text>
        </View>

        <View style={styles.bottomLine}>
          <Text style={styles.category}>
            {category?.displayName ?? "Sem categoria"}
          </Text>

          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BATMAN.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BATMAN.cardBorder,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  leftAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: BATMAN.yellow,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#111",
  },
  infoContainer: {
    flex: 1,
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  description: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: BATMAN.textPrimary,
  },
  value: {
    fontSize: 15,
    fontWeight: "900",
  },
  bottomLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  category: {
    fontSize: 13,
    color: BATMAN.textSecondary,
  },
  date: {
    fontSize: 13,
    color: BATMAN.textSecondary,
  },
});