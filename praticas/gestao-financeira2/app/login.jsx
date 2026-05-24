import { router } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Button from "../components/Button";
import { BATMAN } from "../constants/batmanTheme";
import { MoneyContext } from "../contexts/GlobalState";

export default function Login() {
  const { setUser } = useContext(MoneyContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (!name.trim()) {
      Alert.alert("Erro", "Informe seu nome.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Erro", "Informe a senha.");
      return;
    }

    if (password !== "123456") {
      Alert.alert("Erro", "Senha inválida. Use 123456.");
      return;
    }

    setUser({
      name: name.trim(),
    });

    router.replace("/(tabs)");
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <View style={styles.card}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🦇</Text>
        </View>

        <Text style={styles.mini}>GOTHAM FINANCE</Text>
        <Text style={styles.title}>Acesso ao sistema</Text>
        <Text style={styles.subtitle}>
          Entre para acessar sua gestão financeira.
        </Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
          placeholderTextColor={BATMAN.textSecondary}
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Digite a senha"
          placeholderTextColor={BATMAN.textSecondary}
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.helper}>Senha para teste: 123456</Text>

        <Button onPress={handleLogin}>Entrar</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BATMAN.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: BATMAN.surface,
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: BATMAN.border,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BATMAN.yellow,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 34,
  },
  mini: {
    color: BATMAN.yellow,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.4,
    textAlign: "center",
    marginBottom: 4,
  },
  title: {
    color: BATMAN.textPrimary,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: BATMAN.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 22,
  },
  label: {
    color: BATMAN.yellow,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderColor: BATMAN.border,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: BATMAN.surface2,
    color: BATMAN.textPrimary,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 14,
  },
  helper: {
    color: BATMAN.textSecondary,
    fontSize: 12,
    marginBottom: 18,
  },
});