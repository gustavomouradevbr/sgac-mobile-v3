import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCurso } from './CursoContext';
import { FiltroCurso } from './FiltroCurso';

type DashboardData = {
  totalHorasSubmetidas?: number;
  totalHorasAprovadas?: number;
  totalHorasPendentes?: number;
  totalHorasReprovadas?: number;
  percentualConclusao?: number;
};

export default function DashboardHome() {
  const { cursoAtivo, setCursoAtivo } = useCurso();
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardData>({});

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [storedUserId, storedAuthHeader, storedUserName] = await Promise.all([
          AsyncStorage.getItem('userId'),
          AsyncStorage.getItem('authHeader'),
          AsyncStorage.getItem('userName'),
        ]);

        if (!isMounted) {
          return;
        }

        setNome(storedUserName ?? '');

        if (!storedUserId || !storedAuthHeader) {
          setMetrics({});
          return;
        }

        const response = await fetch(`https://api-sgac-gustavo.onrender.com/api/dashboard/aluno/${storedUserId}`, {
          method: 'GET',
          headers: {
            Authorization: storedAuthHeader,
          },
        });

        if (!isMounted) {
          return;
        }

        if (response.status === 200) {
          const data: DashboardData = await response.json();
          setMetrics(data);
        } else {
          setMetrics({});
        }
      } catch (error) {
        console.error('Erro ao carregar o painel:', error);
        if (isMounted) {
          setMetrics({});
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = nome.trim() ? nome : 'Aluno';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text style={styles.loadingText}>A carregar o painel...</Text>
      </View>
    );
  }

  const horasEnviadas = metrics.totalHorasSubmetidas || 0;
  const horasAprovadas = metrics.totalHorasAprovadas || 0;
  const horasPendentes = metrics.totalHorasPendentes || 0;
  const horasReprovadas = metrics.totalHorasReprovadas || 0;
  const progressoGeral = metrics.percentualConclusao || 0;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Início' }} />

      <View style={styles.pageHeader}>
        <Text style={styles.kicker}>ATIVIDADES COMPLEMENTARES</Text>
        <Text style={styles.title}>Painel Inicial</Text>
        <Text style={styles.subtitle}>Acompanhe seus dados principais e acesse rapidamente as ações mais usadas.</Text>
      </View>

      <FiltroCurso cursoSelecionado={cursoAtivo} onSelecionarCurso={setCursoAtivo} />

      <View style={styles.heroCard}>
        <View style={styles.heroIconWrap}>
          <MaterialIcons name="account-circle" size={30} color="#FFFFFF" />
        </View>
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroTitle}>Olá, {displayName}!</Text>
          <Text style={styles.heroSubtitle}>Seu resumo de atividades aparece aqui com um visual limpo e responsivo.</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard 
          title="Horas Enviadas" 
          value={String(horasEnviadas || 0)} 
          icon="emoji-events" 
          iconColor="#5B8DEF" 
          accentColor="#D7E5FF" 
        />
        <MetricCard 
          title="Aprovadas" 
          value={String(horasAprovadas ?? 0)} 
          icon="check" 
          iconColor="#23B65E" 
          accentColor="#DDF6E8" 
        />
        <MetricCard 
          title="Pendentes" 
          value={String(horasPendentes ?? 0)} 
          icon="schedule" 
          iconColor="#F39C12" 
          accentColor="#FFF1D8" 
        />
        <MetricCard 
          title="Reprovadas" 
          value={String(horasReprovadas ?? 0)} 
          icon="close" 
          iconColor="#3F76FF" 
          accentColor="#E1EBFF" 
        />
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Progresso em {cursoAtivo}</Text>
            <Text style={styles.sectionCaption}>Meta: 200h obrigatórias</Text>
          </View>

          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>{progressoGeral ?? 0}%</Text>
          </View>
        </View>

        <ProgressBar progressPercent={progressoGeral ?? 0} color="#3A76D3" trackColor="#D6DAE3" height={8} />

        <Text style={styles.sectionLegend}>
          {horasAprovadas || 0}h aprovadas de 200h. Faltam {Math.max(200 - (horasAprovadas || 0), 0)}h.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ações rápidas</Text>

        <View style={styles.actionsStack}>
          <ActionButton
            title="Adicionar Atividade"
            subtitle="Registrar nova solicitação"
            backgroundColor="#FFF0D8"
            borderColor="#F7D59D"
            textColor="#7B4B07"
            icon="add"
          />
          <ActionButton
            title="Minhas Atividades"
            subtitle="Acompanhar status"
            backgroundColor="#E6EEF9"
            borderColor="#D2DDF1"
            textColor="#264F96"
            icon="assignment"
          />
        </View>
      </View>
    </ScrollView>
  );
}

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

type ProgressBarProps = {
  progressPercent: number;
  color: string;
  trackColor: string;
  height: number;
};

function ProgressBar({ progressPercent, color, trackColor, height }: ProgressBarProps) {
  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor, height }]}>
      <View style={[styles.progressFill, { backgroundColor: color, width: `${Math.max(0, Math.min(progressPercent, 100))}%` }]} />
    </View>
  );
}

type ActionButtonProps = {
  title: string;
  subtitle: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

function ActionButton({ title, subtitle, backgroundColor, borderColor, textColor, icon }: ActionButtonProps) {
  return (
    <View style={[styles.actionCard, { backgroundColor, borderColor }]}>
      <View style={styles.actionIconWrap}>
        <MaterialIcons name={icon} size={18} color={textColor} />
      </View>
      <Text style={[styles.actionTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.actionSubtitle, { color: textColor }]}>{subtitle}</Text>
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
  heroCard: { backgroundColor: '#2E6FAF', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, shadowColor: '#0F335C', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  heroIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5590D8' },
  heroTextBlock: { flex: 1, gap: 4 },
  heroTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  heroSubtitle: { color: '#E7F0FB', fontSize: 12, lineHeight: 18, fontWeight: '500' },
  metricsGrid: { gap: 10, flexDirection: 'row', flexWrap: 'wrap' },
  metricCard: { flexGrow: 1, flexBasis: '47%', minWidth: 150, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, padding: 12, minHeight: 72, shadowColor: '#1A3B66', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  metricTitle: { color: '#7A8795', fontSize: 11, fontWeight: '700', marginBottom: 8 },
  metricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metricValue: { fontSize: 20, fontWeight: '900' },
  metricIconBubble: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#11345B', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2, gap: 12 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  sectionTitle: { color: '#25364D', fontSize: 15, fontWeight: '800' },
  sectionCaption: { color: '#7D8A9A', fontSize: 11, marginTop: 4, fontWeight: '600' },
  progressPill: { minWidth: 38, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: '#FFE7BC', alignItems: 'center', justifyContent: 'center' },
  progressPillText: { color: '#B87800', fontSize: 11, fontWeight: '900' },
  progressTrack: { width: '100%', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  sectionLegend: { color: '#7D8A9A', fontSize: 11, fontWeight: '600' },
  actionsStack: { gap: 10 },
  actionCard: { minHeight: 92, borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  actionIconWrap: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)' },
  actionTitle: { fontSize: 14, fontWeight: '800' },
  actionSubtitle: { fontSize: 11, fontWeight: '600', lineHeight: 16 },
});