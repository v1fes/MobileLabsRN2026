import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const MENU_ITEMS = [
  { label: 'Новини', icon: 'newspaper-outline', activeIcon: 'newspaper', route: 'Новини' },
  { label: 'Контакти', icon: 'people-outline', activeIcon: 'people', route: 'Контакти' },
];

export default function CustomDrawer(props) {
  const { navigation, state } = props;
  const activeRouteName = state.routes[state.index]?.name;

  return (
    <View style={styles.container}>
      {/* ── Header block ── */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/avatar_vika/160/160' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Фесенко Вікторія{'\n'}Володимирівна</Text>
        <View style={styles.groupBadge}>
          <Ionicons name="school-outline" size={13} color="#6C63FF" style={{ marginRight: 4 }} />
          <Text style={styles.groupText}>ВТ-22-1</Text>
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Menu items ── */}
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={styles.menuContainer}
      >
        {MENU_ITEMS.map((item) => {
          const isActive = activeRouteName === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconWrap, isActive && styles.menuIconWrapActive]}>
                <Ionicons
                  name={isActive ? item.activeIcon : item.icon}
                  size={20}
                  color={isActive ? '#fff' : '#8888aa'}
                />
              </View>
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
              {isActive && (
                <Ionicons name="chevron-forward" size={16} color="#6C63FF" style={styles.menuChevron} />
              )}
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Лабораторна робота №2</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12122a',
  },
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#6C63FF',
    marginBottom: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
    marginBottom: 8,
  },
  groupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108,99,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.35)',
  },
  groupText: {
    fontSize: 12,
    color: '#9b97ff',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  menuContainer: {
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: 'rgba(108,99,255,0.12)',
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconWrapActive: {
    backgroundColor: '#6C63FF',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#8888aa',
    fontWeight: '500',
  },
  menuLabelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  menuChevron: {
    marginLeft: 4,
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  footerText: {
    fontSize: 11,
    color: '#444466',
    fontStyle: 'italic',
  },
});
