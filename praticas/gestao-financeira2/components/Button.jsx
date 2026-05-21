import { StyleSheet, Text, TouchableHighlight } from "react-native";
import { colors } from "../constants/colors";

export default function Button({ children, onPress }) {
  return (
    <TouchableHighlight 
      style={style.background} 
      onPress={onPress}
      underlayColor="#2a9665" 
    >
      <Text style={style.text}>{children}</Text>
    </TouchableHighlight>
  );
}

const style = StyleSheet.create({
  background: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginTop: 12,
  },
  text: {
    color: colors.primaryContrast,
    fontSize: 18,
    fontWeight: "600",
  },
});