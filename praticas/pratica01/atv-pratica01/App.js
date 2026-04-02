import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import GerenciarDespesa from "./screens/GerenciarDespesa";
import DespesasRecentes from "./screens/DespesasRecentes";
import TodasDespesas from "./screens/TodasDespesas";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./components/IconButton";

export default function App() {
  const Tab = createBottomTabNavigator();

  function BottonTabsScreen() {
    const navigation = useNavigation();

    return (
      <Tab.Navigator
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <IconButton
              icon="add"
              size={24}
              onPress={() => {
                navigation.navigate("GerenciarDespesa");
              }}
            />
          ),
        })}
      >
        <Tab.Screen
          name="DespesasRecentes"
          component={DespesasRecentes}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="hourglass" size={size} color={color} />
            ),
            tabBarLabel: "Recentes",
            title: "Despesas Recentes",
            tabBarLabelStyle: { fontSize: 12 },
          }}
        />
        <Tab.Screen
          name="TodasEmpresas"
          component={TodasDespesas}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet-outline" size={size} color={color} />
            ),
            tabBarLabel: "Todas",
            title: "Todas as Despesas",
            tabBarLabelStyle: { fontSize: 12 },
          }}
        />
      </Tab.Navigator>
    );
  }

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Despesas"
          component={BottonTabsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="GerenciarDespesa" component={GerenciarDespesa} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
