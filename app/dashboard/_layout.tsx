import { MaterialIcons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Início', icon: 'home' },
  { href: '/dashboard/cursos', label: 'Cursos', icon: 'school' },
  { href: '/dashboard/adicionar', label: 'Adicionar', icon: 'add' },
  { href: '/dashboard/minhas-atividades', label: 'Minhas Atividades', icon: 'assignment' },
  { href: '/dashboard/regras-do-curso', label: 'Regras do Curso', icon: 'menu-book' },
];

export default function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 900;
  const [drawerVisible, setDrawerVisible] = useState(false);

  const drawerWidth = useMemo(() => Math.min(320, Math.round(width * 0.82)), [width]);

  const navigateTo = (href: string) => {
    setDrawerVisible(false);
    router.push(href);
  };

  const handleLogout = () => {
    setDrawerVisible(false);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isWideLayout ? (
          <Sidebar
            variant="desktop"
            pathname={pathname}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        ) : (
          <View style={styles.mobileHeader}>
            <View style={styles.mobileBrandRow}>
              <View style={styles.mobileLogoShell}>
                <Image
                  source={require('../../assets/senac/senac-logo.png')}
                  style={styles.mobileLogo}
                  resizeMode="contain"
                  accessibilityLabel="Logo do Senac"
                />
              </View>
              <View style={styles.mobileBrandTextBlock}>
                <Text style={styles.mobileBrandTitle}>SGAC</Text>
                <Text style={styles.mobileBrandSubtitle}>Atividades Complementares</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir menu"
              onPress={() => setDrawerVisible(true)}
              style={styles.hamburgerButton}
            >
              <MaterialIcons name="menu" size={26} color="#004A8D" />
            </Pressable>
          </View>
        )}

        <View style={styles.contentShell}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F3F7FB' } }} />
        </View>

        {!isWideLayout ? (
          <Modal
            visible={drawerVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDrawerVisible(false)}
          >
            <View style={styles.modalRoot}>
              <Pressable style={styles.backdrop} onPress={() => setDrawerVisible(false)} />
              <View style={[styles.drawerPanel, { width: drawerWidth }]}>
                <Sidebar
                  variant="mobile"
                  pathname={pathname}
                  onNavigate={navigateTo}
                  onLogout={handleLogout}
                />
              </View>
            </View>
          </Modal>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

type SidebarProps = {
  variant: 'desktop' | 'mobile';
  pathname: string;
  onNavigate: (href: string) => void;
  onLogout: () => void;
};

function Sidebar({ variant, pathname, onNavigate, onLogout }: SidebarProps) {
  const isMobile = variant === 'mobile';

  return (
    <View style={[styles.sidebarBase, isMobile ? styles.mobileSidebar : styles.desktopSidebar]}>
      {isMobile ? (
        <View style={styles.drawerHeader}>
          <View style={styles.drawerBrandRow}>
            <View style={styles.drawerLogoShell}>
              <Image
                source={require('../../assets/senac/senac-logo.png')}
                style={styles.drawerLogo}
                resizeMode="contain"
                accessibilityLabel="Logo do Senac"
              />
            </View>
            <View style={styles.drawerBrandTextBlock}>
              <Text style={styles.drawerBrandTitleLight}>SGAC</Text>
              <Text style={styles.drawerBrandSubtitleLight}>Atividades Complementares</Text>
            </View>
          </View>
          <Text style={styles.drawerHeaderCaption}>Navegue pelas áreas principais</Text>
        </View>
      ) : (
        <View style={styles.desktopBrandBlock}>
          <View style={styles.desktopLogoShell}>
            <Image
              source={require('../../assets/senac/senac-logo.png')}
              style={styles.desktopLogo}
              resizeMode="contain"
              accessibilityLabel="Logo do Senac"
            />
          </View>
          <Text style={styles.desktopBrandTitle}>SGAC</Text>
          <Text style={styles.desktopBrandSubtitle}>Atividades Complementares</Text>
        </View>
      )}

      {isMobile ? (
        <ScrollView contentContainerStyle={styles.mobileDrawerContent} showsVerticalScrollIndicator={false}>
          <NavList variant="mobile" pathname={pathname} onNavigate={onNavigate} />
          <View style={styles.mobileFooter}>
            <View style={styles.mobileUserCard}>
              <MaterialIcons name="person" size={18} color="#004A8D" />
              <Text style={styles.mobileUserText}>Ana Beatriz Santos</Text>
            </View>

            <Pressable onPress={onLogout} style={styles.mobileLogoutButton}>
              <Text style={styles.mobileLogoutText}>Sair</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <>
          <NavList variant="desktop" pathname={pathname} onNavigate={onNavigate} />

          <View style={styles.desktopFooter}>
            <View style={styles.desktopUserChip}>
              <MaterialIcons name="person" size={14} color="#004A8D" />
              <Text style={styles.desktopUserText}>Ana Beatriz Santos</Text>
            </View>

            <Pressable onPress={onLogout} style={styles.desktopLogoutButton}>
              <MaterialIcons name="logout" size={14} color="#FFFFFF" />
              <Text style={styles.desktopLogoutText}>Sair</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

type NavListProps = {
  variant: 'desktop' | 'mobile';
  pathname: string;
  onNavigate: (href: string) => void;
};

function NavList({ variant, pathname, onNavigate }: NavListProps) {
  return (
    <View style={styles.menuList}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
        const isMobile = variant === 'mobile';

        return (
          <Pressable
            key={item.href}
            accessibilityRole="button"
            onPress={() => onNavigate(item.href)}
            style={[
              styles.menuItem,
              isMobile ? styles.mobileMenuItem : styles.desktopMenuItem,
              active && (isMobile ? styles.mobileMenuItemActive : styles.desktopMenuItemActive),
            ]}
          >
            <MaterialIcons
              name={item.icon}
              size={18}
              color={active ? (isMobile ? '#004A8D' : '#FFFFFF') : isMobile ? '#2B415C' : '#D8E8F9'}
            />
            <Text
              style={[
                styles.menuItemText,
                isMobile ? styles.mobileMenuItemText : styles.desktopMenuItemText,
                active && (isMobile ? styles.mobileMenuItemTextActive : styles.desktopMenuItemTextActive),
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F7FB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F7FB',
  },
  contentShell: {
    flex: 1,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4ECF6',
  },
  mobileBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 12,
  },
  mobileLogoShell: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F4F7FC',
    borderWidth: 1,
    borderColor: '#D7E4F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileLogo: {
    width: 42,
    height: 30,
  },
  mobileBrandTextBlock: {
    flexShrink: 1,
  },
  mobileBrandTitle: {
    color: '#004A8D',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  mobileBrandSubtitle: {
    color: '#3A5B83',
    fontSize: 12,
    fontWeight: '700',
  },
  hamburgerButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FB',
    borderWidth: 1,
    borderColor: '#D5E2F0',
  },
  modalRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(12, 23, 38, 0.28)',
  },
  backdrop: {
    flex: 1,
  },
  drawerPanel: {
    backgroundColor: '#F8FBFF',
    borderRightWidth: 1,
    borderRightColor: '#DDE7F2',
    shadowColor: '#0C2340',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 8, height: 0 },
    elevation: 20,
  },
  sidebarBase: {
    padding: 16,
    justifyContent: 'space-between',
  },
  desktopSidebar: {
    width: 280,
    backgroundColor: '#004A8D',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#0B2F57',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  mobileSidebar: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  desktopBrandBlock: {
    gap: 4,
    marginBottom: 18,
  },
  desktopLogoShell: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    marginBottom: 6,
  },
  desktopLogo: {
    width: 60,
    height: 36,
  },
  desktopBrandTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  desktopBrandSubtitle: {
    color: '#D8E8F9',
    fontSize: 12,
    fontWeight: '600',
  },
  drawerHeader: {
    gap: 8,
    marginBottom: 10,
  },
  drawerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  drawerLogoShell: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E6F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerLogo: {
    width: 42,
    height: 30,
  },
  drawerBrandTextBlock: {
    flexShrink: 1,
  },
  drawerBrandTitleLight: {
    color: '#004A8D',
    fontSize: 15,
    fontWeight: '900',
  },
  drawerBrandSubtitleLight: {
    color: '#446688',
    fontSize: 12,
    fontWeight: '700',
  },
  drawerHeaderCaption: {
    color: '#6A7E95',
    fontSize: 12,
    fontWeight: '600',
  },
  menuList: {
    gap: 10,
  },
  menuItem: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  desktopMenuItem: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  desktopMenuItemActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  mobileMenuItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2EAF3',
    shadowColor: '#0D2747',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  mobileMenuItemActive: {
    backgroundColor: '#EAF2FB',
    borderColor: '#C5D9EE',
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '800',
  },
  desktopMenuItemText: {
    color: '#D8E8F9',
  },
  desktopMenuItemTextActive: {
    color: '#FFFFFF',
  },
  mobileMenuItemText: {
    color: '#183A63',
  },
  mobileMenuItemTextActive: {
    color: '#004A8D',
  },
  mobileDrawerContent: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 20,
    gap: 16,
  },
  mobileFooter: {
    gap: 10,
    marginTop: 4,
  },
  mobileUserCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#DFE8F1',
  },
  mobileUserText: {
    color: '#183A63',
    fontSize: 13,
    fontWeight: '800',
    flexShrink: 1,
  },
  mobileLogoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#004A8D',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileLogoutText: {
    color: '#004A8D',
    fontSize: 14,
    fontWeight: '800',
  },
  desktopFooter: {
    gap: 10,
    marginTop: 20,
  },
  desktopUserChip: {
    backgroundColor: '#EAF2FB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  desktopUserText: {
    color: '#183A63',
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  desktopLogoutButton: {
    backgroundColor: '#0B3F73',
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  desktopLogoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});