import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function MinhasAtividades() {
  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Minhas Atividades' }} />

      <Text style={styles.kicker}>ATIVIDADES COMPLEMENTARES</Text>
      <Text style={styles.title}>Minhas Atividades</Text>
      <Text style={styles.subtitle}>Área pronta para exibir o histórico e o status das solicitações.</Text>

      <View style={styles.card}>
        <MaterialIcons name="assignment" size={28} color="#004A8D" />
        <Text style={styles.cardText}>Conteúdo de acompanhamento pode ser adicionado aqui.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 10,
    backgroundColor: '#F3F7FB',
  },
  kicker: {
    color: '#F07C2B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.05,
    textTransform: 'uppercase',
  },
  title: {
    color: '#10233F',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: '#60748A',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2EAF3',
  },
  cardText: {
    flex: 1,
    color: '#26425F',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});