import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdicionarAtividade() {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Adicionar Atividade' }} />

      <View style={styles.pageHeader}>
        <Text style={styles.kicker}>ATIVIDADES COMPLEMENTARES</Text>
        <Text style={styles.title}>Adicionar Atividade</Text>
        <Text style={styles.subtitle}>Registre uma nova atividade complementar</Text>
      </View>

      <View style={styles.beforeCard}>
        <View style={styles.beforeIconWrap}>
          <MaterialIcons name="check-circle" size={22} color="#2CC36B" />
        </View>

        <View style={styles.beforeTextBlock}>
          <Text style={styles.beforeTitle}>Antes de enviar:</Text>
          <Text style={styles.beforeDescription}>
            Preencha os dados obrigatórios e adicione o comprovante da atividade.
          </Text>
        </View>
      </View>

      <View style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Preencher Formulário</Text>
      </View>

      <View style={styles.stepsList}>
        <StepCard number="1" title="Preencha os dados" />
        <StepCard number="2" title="Anexe o comprovante" />
        <StepCard number="3" title="Aguarde validação" />
      </View>

      <View style={styles.studentCard}>
        <View style={styles.studentIconWrap}>
          <MaterialIcons name="person" size={20} color="#5C3E99" />
        </View>

        <View style={styles.studentTextBlock}>
          <Text style={styles.studentTitle}>Aluno</Text>
          <Text style={styles.studentEmail}>ana.beatriz@gmail.com</Text>
        </View>
      </View>

      <Text style={styles.footer}>© 2026 SGAC - Sistema de Gestão de Atividades Complementares</Text>
    </ScrollView>
  );
}

type StepCardProps = {
  number: string;
  title: string;
};

function StepCard({ number, title }: StepCardProps) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumberWrap}>
        <Text style={styles.stepNumber}>{number}</Text>
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 28,
    gap: 14,
  },
  pageHeader: {
    gap: 4,
    paddingTop: 4,
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
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 35,
  },
  subtitle: {
    color: '#60748A',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 2,
  },
  beforeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#0F335C',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E4ECF6',
  },
  beforeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F8FC',
    borderWidth: 1,
    borderColor: '#DCE6F0',
  },
  beforeTextBlock: {
    flex: 1,
    gap: 4,
  },
  beforeTitle: {
    color: '#10233F',
    fontSize: 15,
    fontWeight: '900',
  },
  beforeDescription: {
    color: '#5D7086',
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#2F66F2',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F66F2',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  stepsList: {
    gap: 10,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2EAF3',
    shadowColor: '#10345F',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  stepNumberWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FB',
  },
  stepNumber: {
    color: '#2F66F2',
    fontSize: 17,
    fontWeight: '900',
  },
  stepTitle: {
    color: '#10233F',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2EAF3',
    shadowColor: '#10345F',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  studentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1D8',
  },
  studentTextBlock: {
    flex: 1,
    gap: 4,
  },
  studentTitle: {
    color: '#10233F',
    fontSize: 15,
    fontWeight: '900',
  },
  studentEmail: {
    color: '#4B6A92',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    color: '#5E7188',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingTop: 6,
  },
});