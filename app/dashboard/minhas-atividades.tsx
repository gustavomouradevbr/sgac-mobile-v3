import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { apiFetch } from '../../src/services/api';
import type { SubmissaoResponse } from '../../src/services/types';
type FiltroStatus = 'TODOS' | 'PENDENTE' | 'APROVADA' | 'REPROVADA';

function formatarData(dataISO: string) {
  const [ano, mes, dia] = dataISO.split('-');
  if (!ano || !mes || !dia) return dataISO;
  return `${dia}/${mes}/${ano}`;
}

function statusInfo(status: SubmissaoResponse['status']) {
  switch (status) {
    case 'APROVADA':
      return { label: 'Aprovada', icon: 'check-circle' as const, color: '#1E8E4D', bg: '#DDF6E8' };
    case 'REPROVADA':
      return { label: 'Reprovada', icon: 'cancel' as const, color: '#B42318', bg: '#FDE4E1' };
    default:
      return { label: 'Pendente', icon: 'schedule' as const, color: '#B87800', bg: '#FFF1D8' };
  }
}

function ContadorCard({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <View style={styles.counterCard}>
      <Text style={styles.counterTitle}>{titulo}</Text>
      <Text style={styles.counterValue}>{valor}</Text>
    </View>
  );
}

function AtividadeCard({ atividade }: { atividade: SubmissaoResponse }) {
  const status = statusInfo(atividade.status);

  return (
    <View style={styles.activityCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.activityTitle}>{atividade.titulo}</Text>
          <Text style={styles.activitySubtitle}>{atividade.cursoNome}</Text>
        </View>

        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <MaterialIcons name={status.icon} size={15} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
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
          <Text style={styles.infoValue}>{formatarData(atividade.dataAtividade)}</Text>
        </View>
      </View>

      {atividade.descricao ? <Text style={styles.description}>{atividade.descricao}</Text> : null}

      <View style={styles.fileRow}>
        <MaterialIcons name="attach-file" size={17} color="#60748A" />
        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
          {atividade.nomeArquivoComprovante ?? 'Comprovante enviado'}
        </Text>
      </View>
    </View>
  );
}

export default function MinhasAtividades() {
  const router = useRouter();
  const [atividades, setAtividades] = useState<SubmissaoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<FiltroStatus>('TODOS');

  useEffect(() => {
    loadAtividades();
  }, []);

  const loadAtividades = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const data = await apiFetch<SubmissaoResponse[]>(`/api/submissoes/aluno/${userId}`);
      setAtividades(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar seu histórico de atividades.');
    } finally {
      setLoading(false);
    }
  };

  const pendentes = atividades.filter((atividade) => atividade.status === 'PENDENTE').length;
  const aprovadas = atividades.filter((atividade) => atividade.status === 'APROVADA').length;
  const reprovadas = atividades.filter((atividade) => atividade.status === 'REPROVADA').length;
  const atividadesFiltradas = filtro === 'TODOS'
    ? atividades
    : atividades.filter(a => a.status === filtro);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text style={styles.emptyText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Minhas Atividades' }} />

      <View style={styles.header}>
        <Text style={styles.title}>Minhas Atividades</Text>
        <Text style={styles.subtitle}>Acompanhe o status dos seus envios</Text>
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

      <View style={styles.filtrosRow}>
        {(['TODOS','PENDENTE','APROVADA','REPROVADA'] as FiltroStatus[]).map(f => (
          <Pressable
            key={f}
            onPress={() => setFiltro(f)}
            style={[styles.filtroChip, filtro === f && styles.filtroChipAtivo]}
          >
            <Text style={[styles.filtroTexto, filtro === f && styles.filtroTextoAtivo]}>
              {f === 'TODOS' ? 'Todos' : f === 'PENDENTE' ? 'Pendentes'
               : f === 'APROVADA' ? 'Aprovadas' : 'Reprovadas'}
            </Text>
          </Pressable>
        ))}
      </View>

      {atividadesFiltradas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="assignment" size={34} color="#004A8D" />
          <Text style={styles.emptyText}>{atividades.length === 0 ? 'Nenhuma atividade submetida ainda.' : 'Nenhuma atividade encontrada para este filtro.'}</Text>
        </View>
      ) : (
        atividadesFiltradas.map((item) => <AtividadeCard key={item.id} atividade={item} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, gap: 14, backgroundColor: '#F3F7FB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F7FB' },
  header: { marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', color: '#10233F' },
  subtitle: { fontSize: 14, color: '#60748A', marginTop: 4 },
  countersGrid: { flexDirection: 'row', gap: 10 },
  counterCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E4ECF6' },
  counterTitle: { color: '#60748A', fontSize: 11, fontWeight: '800' },
  counterValue: { color: '#10233F', fontSize: 22, fontWeight: '900', marginTop: 4 },
  addButton: { backgroundColor: '#2F66F2', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { color: '#60748A', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  activityCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E4ECF6' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 },
  cardTitleBlock: { flex: 1 },
  activityTitle: { fontSize: 16, fontWeight: '700', color: '#153150' },
  activitySubtitle: { fontSize: 12, color: '#60748A', marginTop: 2, fontWeight: '700' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  infoGrid: { flexDirection: 'row', gap: 8 },
  infoItem: { flex: 1, backgroundColor: '#F5F8FC', borderRadius: 12, padding: 10 },
  infoLabel: { color: '#708299', fontSize: 10, fontWeight: '800', marginBottom: 4 },
  infoValue: { color: '#10233F', fontSize: 12, fontWeight: '900' },
  description: { color: '#455B73', fontSize: 13, lineHeight: 19, marginTop: 12 },
  fileRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  fileName: { flex: 1, color: '#60748A', fontSize: 12, fontWeight: '600' },
});