import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AtividadeAluno, StatusAtividade, useAtividades } from './AtividadesContext';

// Formata a data de 2026-06-02 para 02/06/2026
function formatarData(dataISO: string) {
  const [ano, mes, dia] = dataISO.split('-');

  if (!ano || !mes || !dia) {
    return dataISO;
  }

  return `${dia}/${mes}/${ano}`;
}

// Define texto, ícone e cores de cada status
function statusInfo(status: StatusAtividade) {
  const infos = {
    PENDENTE: {
      label: 'Pendente',
      icon: 'schedule' as const,
      color: '#B87800',
      bg: '#FFF1D8',
    },
    APROVADA: {
      label: 'Aprovada',
      icon: 'check-circle' as const,
      color: '#1E8E4D',
      bg: '#DDF6E8',
    },
    REPROVADA: {
      label: 'Reprovada',
      icon: 'cancel' as const,
      color: '#B42318',
      bg: '#FDE4E1',
    },
  };

  return infos[status];
}

// Card dos contadores
function ContadorCard({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <View style={styles.counterCard}>
      <Text style={styles.counterTitle}>{titulo}</Text>
      <Text style={styles.counterValue}>{valor}</Text>
    </View>
  );
}

// Card de uma atividade
function AtividadeCard({ atividade }: { atividade: AtividadeAluno }) {
  const status = statusInfo(atividade.status);

  return (
    <View style={styles.activityCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.activityTitle}>{atividade.titulo}</Text>
          <Text style={styles.activitySubtitle}>{atividade.curso}</Text>
        </View>

        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <MaterialIcons name={status.icon} size={15} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Área</Text>
          <Text style={styles.infoValue}>{atividade.area}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Horas</Text>
          <Text style={styles.infoValue}>{atividade.cargaHoraria}h</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data</Text>
          <Text style={styles.infoValue}>
            {formatarData(atividade.dataAtividade)}
          </Text>
        </View>
      </View>

      {atividade.descricao ? (
        <Text style={styles.description}>{atividade.descricao}</Text>
      ) : null}

      <View style={styles.fileRow}>
        <MaterialIcons name="attach-file" size={17} color="#60748A" />
        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
          {atividade.comprovanteNome}
        </Text>
      </View>
    </View>
  );
}

export default function MinhasAtividades() {
  const router = useRouter();

  // Aqui pega as atividades que foram salvas no formulário
  const { atividades } = useAtividades();

  const pendentes = atividades.filter((atividade) => atividade.status === 'PENDENTE').length;
  const aprovadas = atividades.filter((atividade) => atividade.status === 'APROVADA').length;
  const reprovadas = atividades.filter((atividade) => atividade.status === 'REPROVADA').length;

  return (
    <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Minhas Atividades' }} />

      <View style={styles.pageHeader}>
        <Text style={styles.kicker}>ATIVIDADES COMPLEMENTARES</Text>
        <Text style={styles.title}>Minhas Atividades</Text>
        <Text style={styles.subtitle}>
          Acompanhe o histórico e o status das solicitações enviadas.
        </Text>
      </View>

      <View style={styles.countersGrid}>
        <ContadorCard titulo="Pendentes" valor={pendentes} />
        <ContadorCard titulo="Aprovadas" valor={aprovadas} />
        <ContadorCard titulo="Reprovadas" valor={reprovadas} />
      </View>

      <Pressable style={styles.addButton} onPress={() => router.push('/dashboard/adicionar')}>
        <MaterialIcons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Adicionar nova atividade</Text>
      </Pressable>

      {atividades.length === 0 ? (
        <View style={styles.emptyCard}>
          <MaterialIcons name="assignment" size={34} color="#004A8D" />
          <Text style={styles.emptyTitle}>Nenhuma atividade cadastrada</Text>
          <Text style={styles.emptyText}>
            Quando você enviar uma solicitação, ela aparecerá aqui com status pendente.
          </Text>
        </View>
      ) : (
        <View style={styles.activitiesList}>
          {atividades.map((atividade) => (
            <AtividadeCard key={atividade.id} atividade={atividade} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 28,
    gap: 14,
    backgroundColor: '#F3F7FB',
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
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: '#60748A',
    fontSize: 15,
    lineHeight: 22,
  },
  countersGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  counterCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2EAF3',
  },
  counterTitle: {
    color: '#60748A',
    fontSize: 11,
    fontWeight: '800',
  },
  counterValue: {
    color: '#10233F',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#2F66F2',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  emptyCard: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2EAF3',
  },
  emptyTitle: {
    color: '#10233F',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },
  emptyText: {
    color: '#60748A',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2EAF3',
    shadowColor: '#10345F',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    color: '#10233F',
    fontSize: 16,
    fontWeight: '900',
  },
  activitySubtitle: {
    color: '#60748A',
    fontSize: 12,
    fontWeight: '700',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '900',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#F5F8FC',
    borderRadius: 12,
    padding: 10,
  },
  infoLabel: {
    color: '#708299',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  infoValue: {
    color: '#10233F',
    fontSize: 12,
    fontWeight: '900',
  },
  description: {
    color: '#455B73',
    fontSize: 13,
    lineHeight: 19,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#EEF3F8',
    paddingTop: 10,
  },
  fileName: {
    flex: 1,
    color: '#60748A',
    fontSize: 12,
    fontWeight: '700',
  },
});