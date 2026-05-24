import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 900;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.shell, isWideLayout ? styles.shellWide : styles.shellNarrow]}>
          <View style={[styles.sidebar, isWideLayout ? styles.sidebarWide : styles.sidebarNarrow]}>
            <View style={styles.brandBlock}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandInitials}>SGAC</Text>
              </View>
              <Text style={styles.brandTitle}>Atividades Complementares</Text>
              <Text style={styles.brandSubtitle}>SGAC</Text>
            </View>

            <View style={styles.menuList}>
              <SidebarItem icon="home" label="Início" active />
              <SidebarItem icon="add" label="Adicionar" />
              <SidebarItem icon="assignment" label="Minhas Atividades" />
              <SidebarItem icon="menu-book" label="Regras do Curso" />
            </View>

            <View style={styles.sidebarFooter}>
              <View style={styles.userChip}>
                <MaterialIcons name="person" size={14} color="#004A8D" />
                <Text style={styles.userChipText}>Ana Beatriz Santos</Text>
              </View>

              <View style={styles.logoutButton}>
                <MaterialIcons name="logout" size={14} color="#FFFFFF" />
                <Text style={styles.logoutText}>Sair</Text>
              </View>
            </View>
          </View>

          <View style={styles.main}>
            <View style={styles.breadcrumbRow}>
              <Text style={styles.breadcrumbMuted}>Atividades Complementares</Text>
              <Text style={styles.breadcrumbDivider}> / </Text>
              <Text style={styles.breadcrumbActive}>SGAC</Text>
            </View>

            <View style={styles.heroCard}>
              <View style={styles.heroIconWrap}>
                <FontAwesome5 name="user-circle" size={30} color="#FFFFFF" />
              </View>
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroTitle}>Olá, Ana Beatriz Santos!</Text>
                <Text style={styles.heroSubtitle}>
                  Acompanhe suas atividades e o progresso no curso. Nenhum curso vinculado.
                </Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <MetricCard title="Total de Atividades" value="3" icon="emoji-events" iconColor="#5B8DEF" accentColor="#D7E5FF" />
              <MetricCard title="Aprovadas" value="1" icon="check" iconColor="#23B65E" accentColor="#DDF6E8" />
              <MetricCard title="Pendentes" value="1" icon="schedule" iconColor="#F39C12" accentColor="#FFF1D8" />
              <MetricCard title="Reprovadas" value="1" icon="close" iconColor="#3F76FF" accentColor="#E1EBFF" />
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>Progresso Geral</Text>
                  <Text style={styles.sectionCaption}>Meta: 200h obrigatórias</Text>
                </View>

                <View style={styles.progressPill}>
                  <Text style={styles.progressPillText}>5%</Text>
                </View>
              </View>

              <ProgressBar progress={0.05} color="#3A76D3" trackColor="#D6DAE3" height={8} />

              <Text style={styles.sectionLegend}>10h concluídas de 200h. Faltam 190h.</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Horas por Área</Text>

              <View style={styles.areaCard}>
                <Text style={styles.areaLabel}>Eventos</Text>
                <Text style={styles.areaHours}>10h aprovadas</Text>
                <ProgressBar progress={0.32} color="#3A76D3" trackColor="#E3E8F1" height={6} />
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Ações rápidas</Text>

              <View style={styles.actionsRow}>
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

type SidebarItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active?: boolean;
};

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <View style={[styles.menuItem, active && styles.menuItemActive]}>
      <MaterialIcons name={icon} size={16} color={active ? '#FFFFFF' : '#D8E8F9'} />
      <Text style={[styles.menuItemText, active && styles.menuItemTextActive]}>{label}</Text>
    </View>
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
  progress: number;
  color: string;
  trackColor: string;
  height: number;
};

function ProgressBar({ progress, color, trackColor, height }: ProgressBarProps) {
  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor, height }]}>
      <View style={[styles.progressFill, { backgroundColor: color, width: `${Math.max(0, Math.min(progress, 1)) * 100}%` }]} />
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
  screen: {
    flex: 1,
    backgroundColor: '#F3F7FB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 24,
  },
  shell: {
    flex: 1,
    gap: 16,
  },
  shellWide: {
    flexDirection: 'row',
  },
  shellNarrow: {
    flexDirection: 'column',
  },
  sidebar: {
    backgroundColor: '#004A8D',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#0B2F57',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    justifyContent: 'space-between',
  },
  sidebarWide: {
    width: 210,
    minHeight: 720,
  },
  sidebarNarrow: {
    width: '100%',
  },
  brandBlock: {
    gap: 4,
    marginBottom: 20,
  },
  brandBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
  },
  brandInitials: {
    color: '#004A8D',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  brandSubtitle: {
    color: '#D8E8F9',
    fontSize: 12,
    fontWeight: '600',
  },
  menuList: {
    gap: 10,
  },
  menuItem: {
    minHeight: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  menuItemActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  menuItemText: {
    color: '#D8E8F9',
    fontSize: 13,
    fontWeight: '700',
  },
  menuItemTextActive: {
    color: '#FFFFFF',
  },
  sidebarFooter: {
    gap: 10,
    marginTop: 20,
  },
  userChip: {
    backgroundColor: '#EAF2FB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userChipText: {
    color: '#183A63',
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  logoutButton: {
    backgroundColor: '#0B3F73',
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  main: {
    flex: 1,
    gap: 14,
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  breadcrumbMuted: {
    color: '#8A97A9',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  breadcrumbDivider: {
    color: '#9AA6B8',
    fontSize: 12,
    fontWeight: '800',
  },
  breadcrumbActive: {
    color: '#004A8D',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  heroCard: {
    backgroundColor: '#2E6FAF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#0F335C',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5590D8',
  },
  heroTextBlock: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#E7F0FB',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flexGrow: 1,
    flexBasis: '47%',
    minWidth: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    minHeight: 72,
    shadowColor: '#1A3B66',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  metricTitle: {
    color: '#7A8795',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  metricIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#11345B',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: '#25364D',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionCaption: {
    color: '#7D8A9A',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  progressPill: {
    minWidth: 38,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFE7BC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPillText: {
    color: '#B87800',
    fontSize: 11,
    fontWeight: '900',
  },
  progressTrack: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  sectionLegend: {
    color: '#7D8A9A',
    fontSize: 11,
    fontWeight: '600',
  },
  areaCard: {
    borderWidth: 1,
    borderColor: '#DCE4EF',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    maxWidth: 340,
  },
  areaLabel: {
    color: '#33465F',
    fontSize: 12,
    fontWeight: '800',
  },
  areaHours: {
    color: '#2B73F0',
    fontSize: 11,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  actionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.56)',
    marginBottom: 2,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  actionSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
});