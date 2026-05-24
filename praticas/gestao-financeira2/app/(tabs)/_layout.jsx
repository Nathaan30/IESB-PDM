import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { BATMAN } from "../../constants/batmanTheme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: BATMAN.background,
        },
        headerTintColor: BATMAN.yellow,
        headerTitleStyle: {
          fontWeight: "900",
        },
        tabBarStyle: {
          backgroundColor: BATMAN.surface,
          borderTopColor: BATMAN.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: BATMAN.yellow,
        tabBarInactiveTintColor: BATMAN.textSecondary,
        tabBarLabelStyle: {
          fontWeight: "800",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Transações",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="account-balance-wallet"
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add-transactions"
        options={{
          title: "Adicionar",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="add-circle" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="summary"
        options={{
          title: "Resumo",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="pie-chart" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="category" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}