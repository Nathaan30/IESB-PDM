import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { BATMAN } from "../constants/batmanTheme";

export default function Button({ children, onPress, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 14,
    backgroundColor: BATMAN.yellow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BATMAN.yellowSoft,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: BATMAN.background,
    fontSize: 16,
    fontWeight: "900",
  },
});