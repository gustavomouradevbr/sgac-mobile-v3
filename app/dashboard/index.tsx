import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { apiFetch } from '../../src/services/api';
import type { AlunoProgressoDTO } from '../../src/services/types';

export default function DashboardHome() {
  const [userName, setUserName] = useState('');
  const [dashboardData, setDashboardData] = useState<AlunoProgressoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [storedUserId, storedUserName] = await Promise.all([
          AsyncStorage.getItem('userId'),
          AsyncStorage.getItem('userName'),
        ]);

        if (!isMounted) return;

        setUserName(storedUserName ?? '');

        if (!storedUserId) {
          setErrorMsg('Sessão expirada. Faça login novamente.');
          return;
        }

        const data = await apiFetch<AlunoProgressoDTO>(`/api/dashboard/aluno/${storedUserId}`);

        if (isMounted) {
          setDashboardData(data);
          setErrorMsg(null);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setErrorMsg(error instanceof Error ? error.message : 'Erro ao carregar o painel.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = userName.trim() || 'Aluno';

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text style={styles.loadingText}>A carregar o painel...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="error-outline" size={40} color="#B42318" />
        <Text style={[styles.loadingText, { color: '#B42318', textAlign: 'center' }]}>{errorMsg}</Text>
      </View>
    );
  }

  const totalAtividades = dashboardData?.totalAtividades ?? 0;
  const aprovadas = dashboardData?.aprovadas ?? 0;
  const pendentes = dashboardData?.pendentes ?? 0;
  const reprovadas = dashboardData?.reprovadas ?? 0;
  const percentual = dashboardData?.percentualConcluido ?? 0;
  const horasAprovadas = dashboardData?.totalHorasAprovadas ?? 0;
  const cargaMin = dashboardData?.cargaHorariaMinima ?? 120;
  const faltam = Math.max(0, cargaMin - horasAprovadas);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Início' }} />

      <View style={styles.pageHeader}>
        <Text style={styles.kicker}>ATIVIDADES COMPLEMENTARES</Text>
        <Text style={styles.title}>Painel Inicial</Text>
        <Text style={styles.subtitle}>Acompanhe seus dados principais e acesse rapidamente as ações mais usadas.</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIconWrap}>
          <MaterialIcons name="account-circle" size={30} color="#FFFFFF" />
        </View>
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroTitle}>Olá, {displayName}!</Text>
          <Text style={styles.heroSubtitle}>Seu resumo de atividades complementares aparece aqui.</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard title="Total de Atividades" value={String(totalAtividades)} icon="emoji-events" iconColor="#5B8DEF" accentColor="#D7E5FF" />
        <MetricCard title="Aprovadas" value={String(aprovadas)} icon="check" iconColor="#23B65E" accentColor="#DDF6E8" />
        <MetricCard title="Pendentes" value={String(pendentes)} icon="schedule" iconColor="#F39C12" accentColor="#FFF1D8" />
        <MetricCard title="Reprovadas" value={String(reprovadas)} icon="close" iconColor="#B42318" accentColor="#FDE4E1" />
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Progresso Geral</Text>
            <Text style={styles.sectionCaption}>Meta: {cargaMin}h obrigatórias</Text>
          </View>
          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>{percentual.toFixed(1)}%</Text>
          </View>
        </View>

        <ProgressBar progressPercent={percentual} color="#3A76D3" trackColor="#D6DAE3" height={8} />

        <Text style={styles.sectionLegend}>
          {horasAprovadas.toFixed(0)}h aprovadas de {cargaMin}h. Faltam {faltam.toFixed(0)}h.
        </Text>
      </View>

      {dashboardData?.horasPorArea && dashboardData.horasPorArea.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Horas por Área</Text>
          {dashboardData.horasPorArea.filter(h => h.horasAprovadas > 0 || h.horasPendentes > 0).map(h => (
            <View key={h.area} style={styles.areaRow}>
              <Text style={styles.areaLabel}>{AREA_LABELS[h.area] ?? h.area}</Text>
              <Text style={styles.areaHoras}>✅ {h.horasAprovadas}h  ⏳ {h.horasPendentes}h</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const AREA_LABELS: Record<string, string> = {
  ENSINO: 'Ensino',
  PESQUISA: 'Pesquisa',
  EXTENSAO: 'Extensão',
  CULTURA: 'Cultura',
  EVENTOS: 'Eventos',
};

type MetricCardProps = {
  title: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  accentColor: string;
};

function MetricCard({ title, value, icon, iconColor, accentColor }: MetricCardProps) {
  return (
    <View style={[styles.metricCard, { borderColor: accentColor }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricRow}>
        <Text style={[styles.metricValue, { color: iconColor }]}>{value}</Text>
        <View style={[styles.metricIconBubble, { backgroundColor: accentColor }]}>
          <MaterialIcons name={icon} size={18} color={iconColor} />
        </View>
      </View>
    </View>
  );
}

type ProgressBarProps = { progressPercent: number; color: string; trackColor: string; height: number };

function ProgressBar({ progressPercent, color, trackColor, height }: ProgressBarProps) {
  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor, height }]}>
      <View style={[styles.progressFill, { backgroundColor: color, width: `${Math.max(0, Math.min(progressPercent, 100))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 16, paddingBottom: 28, gap: 14 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F7FB', gap: 12, padding: 24 },
  loadingText: { color: '#60748A', fontSize: 15, fontWeight: '600' },
  pageHeader: { gap: 4, paddingTop: 4 },
  kicker: { color: '#F07C2B', fontSize: 12, fontWeight: '900', letterSpacing: 1.05, textTransform: 'uppercase' },
  title: { color: '#10233F', fontSize: 28, fontWeight: '900', lineHeight: 34 },
  subtitle: { color: '#60748A', fontSize: 15, lineHeight: 22, marginTop: 2 },
  heroCard: { backgroundColor: '#2E6FAF', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5590D8' },
  heroTextBlock: { flex: 1, gap: 4 },
  heroTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  heroSubtitle: { color: '#E7F0FB', fontSize: 12, lineHeight: 18 },
  metricsGrid: { gap: 10, flexDirection: 'row', flexWrap: 'wrap' },
  metricCard: { flexGrow: 1, flexBasis: '47%', minWidth: 150, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, padding: 12, minHeight: 72 },
  metricTitle: { color: '#7A8795', fontSize: 11, fontWeight: '700', marginBottom: 8 },
  metricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metricValue: { fontSize: 20, fontWeight: '900' },
  metricIconBubble: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 12 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  sectionTitle: { color: '#25364D', fontSize: 15, fontWeight: '800' },
  sectionCaption: { color: '#7D8A9A', fontSize: 11, marginTop: 4 },
  progressPill: { minWidth: 52, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: '#FFE7BC', alignItems: 'center' },
  progressPillText: { color: '#B87800', fontSize: 11, fontWeight: '900' },
  progressTrack: { width: '100%', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  sectionLegend: { color: '#7D8A9A', fontSize: 11, fontWeight: '600' },
  areaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  areaLabel: { color: '#334155', fontSize: 13, fontWeight: '600' },
  areaHoras: { color: '#64748B', fontSize: 12 },
});