import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

export default function CategoryPicker({ form, setForm, categories }) {
  return (
    <View>
      <Text style={globalStyles.inputLabel}>Categoria</Text>

      <View style={styles.picker}>
        <Picker
          selectedValue={form.categoryId}
          onValueChange={(itemValue) =>
            setForm({ ...form, categoryId: itemValue })
          }
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
  );
}

const styles = StyleSheet.create({
  picker: {
    display: "flex",
    justifyContent: "center",
    height: 44,
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
    flexGrow: 1,
  },
});