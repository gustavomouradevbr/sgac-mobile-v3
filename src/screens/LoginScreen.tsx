import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const buildBasicAuthHeader = (email: string, password: string) => {
  const credentials = `${email}:${password}`;
  const encodedCredentials = globalThis.btoa(credentials);

  return `Basic ${encodedCredentials}`;
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const sanitizedEmail = email.trim();
    const sanitizedPassword = password.trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      Alert.alert('Atenção', 'Informe o e-mail e a senha para continuar.');
      return;
    }

    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      setIsLoading(true);

      timeoutId = setTimeout(() => {
        controller.abort();
      }, 60000);

      console.log('Iniciando requisição para o Render...');

      const response = await fetch('https://api-sgac-gustavo.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          senha: sanitizedPassword,
          perfil: 'ALUNO' 
        }),
        signal: controller.signal,
      });

      if (response.status === 200) {
        const data = await response.json();
        const authHeader = buildBasicAuthHeader(sanitizedEmail, sanitizedPassword);

        await AsyncStorage.setItem('authHeader', authHeader);
        await AsyncStorage.setItem('userId', String(data.id ?? ''));
        await AsyncStorage.setItem('userName', String(data.nome ?? ''));

        router.push('/dashboard');
        return;
      }

      let errorMessage = 'Não foi possível autenticar. Verifique seus dados e tente novamente.';

      try {
        const errorBody = await response.json();
        if (typeof errorBody?.message === 'string' && errorBody.message.trim()) {
          errorMessage = errorBody.message;
        }
      } catch {
        // Mantém a mensagem padrão quando a API não retorna JSON válido.
      }

      Alert.alert('Falha no login', errorMessage);
    } catch (error: unknown) {
      const isAbortError = error instanceof Error && error.name === 'AbortError';

      if (isAbortError) {
        Alert.alert(
          'Tempo esgotado',
          'A requisição demorou mais de 60 segundos e foi cancelada. Tente novamente.'
        );
      } else {
        Alert.alert(
          'Erro de conexão',
          'Não foi possível conectar à API do Render. Verifique a internet e tente novamente.'
        );
      }

      console.error('Erro ao tentar fazer login:', error);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={styles.logoWrap}>
                <Image
                  source={require('../../assets/senac/senac-logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                  accessibilityLabel="Logo do Senac"
                />
              </View>

              <Text style={styles.kicker}>SGAC - Portal do Aluno</Text>
              <Text style={styles.title}>Acesse à sua área institucional</Text>
              <Text style={styles.subtitle}>
                Entre com suas credenciais para consultar informações acadêmicas e serviços do portal.
              </Text>

              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>E-mail institucional</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="nome@senac.br"
                    placeholderTextColor="#8CA0B7"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    textContentType="username"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Senha</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Digite a sua senha"
                    placeholderTextColor="#8CA0B7"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    textContentType="password"
                    editable={!isLoading}
                  />
                </View>

                <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
                  {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#0C2340',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  logoWrap: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 160, height: 72 },
  kicker: {
    color: '#004A8D',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: { color: '#10233F', fontSize: 28, fontWeight: '800', lineHeight: 34 },
  subtitle: { color: '#60748A', fontSize: 15, lineHeight: 22, marginTop: 12 },
  form: { marginTop: 28, gap: 16 },
  field: { gap: 8 },
  label: { color: '#153150', fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#D8E2EE',
    borderRadius: 16,
    backgroundColor: '#F9FBFD',
    color: '#10233F',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  button: {
    backgroundColor: '#004A8D',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 4,
    minHeight: 52,
  },
  buttonDisabled: { opacity: 0.75 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  gradient: { flex: 1, backgroundColor: '#2E7D9A' },
});