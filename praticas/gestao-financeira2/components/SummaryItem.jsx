import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { BATMAN } from "../constants/batmanTheme";

export default function SummaryItem({ category, value }) {
  const valueStyle = category.isIncome ? BATMAN.green : BATMAN.red;

  return (
    <View style={styles.card}>
      <View style={styles.leftAccent} />

      <View
        style={[
          styles.iconContainer,
          { backgroundColor: category.background ?? BATMAN.yellow },
        ]}
      >
        <MaterialIcons
          name={category.icon ?? "category"}
          size={24}
          color={BATMAN.background}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.categoryName}>{category.displayName}</Text>

        <Text style={[styles.value, { color: valueStyle }]}>
          {Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BATMAN.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BATMAN.border,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: BATMAN.background,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  categoryName: {
    flex: 1,
    color: BATMAN.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  value: {
    fontSize: 15,
    fontWeight: "900",
  },
});