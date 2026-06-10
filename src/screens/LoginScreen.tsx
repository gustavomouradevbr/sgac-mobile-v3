// Hooks e APIs React/Expo usados na tela
// Não usar expo-linear-gradient para evitar dependência externa
import { useRouter } from 'expo-router'; // Router do Expo para navegação entre telas
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
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  // Estados locais para os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função chamada ao pressionar o botão Entrar
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('https://api-sgac-gustavo.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('Login efetuado com sucesso:', data);
        router.push('/dashboard');
        return;
      }

      Alert.alert('Falha no Login', 'E-mail ou senha incorretos.');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor do Render.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Fundo sólido aproximando o gradiente da imagem (sem dependências extras)
    <View style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              {/* Área do logotipo */}
              <View style={styles.logoWrap}>
                <Image
                  source={require('../../assets/senac/senac-logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                  accessibilityLabel="Logo do Senac"
                />
              </View>

              {/* Títulos e descrição */}
              <Text style={styles.kicker}>SGAC - Portal do Aluno</Text>
              <Text style={styles.title}>Acesse sua área institucional</Text>
              <Text style={styles.subtitle}>
                Entre com suas credenciais para consultar informações acadêmicas e serviços do portal.
              </Text>

              {/* Formulário de login */}
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
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Senha</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#8CA0B7"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    textContentType="password"
                  />
                </View>

                {/* Botão de submissão (chama handleLogin) */}
                <Pressable style={styles.button} onPress={handleLogin} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                  )}
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
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
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
  logoWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 72,
  },
  kicker: {
    color: '#004A8D',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#10233F',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: '#60748A',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  form: {
    marginTop: 28,
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    color: '#153150',
    fontSize: 14,
    fontWeight: '600',
  },
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  gradient: {
    flex: 1,
    backgroundColor: '#2E7D9A', // cor sólida aproximada ao gradiente desejado
  },
});