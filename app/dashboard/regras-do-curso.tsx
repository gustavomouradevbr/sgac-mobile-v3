import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function RegrasDoCurso() {
  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Regras do Curso' }} />

      <Text style={styles.kicker}>ATIVIDADES COMPLEMENTARES</Text>
      <Text style={styles.title}>Regras do Curso</Text>
      <Text style={styles.subtitle}>Espaço reservado para normas, critérios e orientações do curso.</Text>

      <View style={styles.card}>
        <MaterialIcons name="menu-book" size={28} color="#004A8D" />
        <Text style={styles.cardText}>As regras podem ser organizadas em tópicos aqui.</Text>
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