import React from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTACTS_SECTIONS = [
  {
    title: 'Викладачі',
    icon: 'school-outline',
    color: '#6C63FF',
    data: [
      { id: '1', name: 'Іваненко Іван Іванович', role: 'старший викладач', phone: '+380 44 123-45-67', avatar: 'IV' },
      { id: '2', name: 'Петренко Петро Петрович', role: 'доцент, к.т.н.', phone: '+380 44 234-56-78', avatar: 'PP' },
      { id: '3', name: 'Сидоренко Марія Олегівна', role: 'асистент', phone: '+380 44 345-67-89', avatar: 'SM' },
      { id: '4', name: 'Коваленко Андрій Вікторович', role: 'лектор', phone: '+380 44 456-78-90', avatar: 'KA' },
    ],
  },
  {
    title: 'Адміністрація',
    icon: 'business-outline',
    color: '#2A9D8F',
    data: [
      { id: '5', name: 'Мельник Олена Іванівна', role: 'декан факультету', phone: '+380 44 567-89-01', avatar: 'МО' },
      { id: '6', name: 'Бондаренко Сергій', role: 'секретар деканату', phone: '+380 44 678-90-12', avatar: 'БС' },
      { id: '7', name: 'Шевченко Наталія', role: 'методист', phone: '+380 44 789-01-23', avatar: 'ШН' },
    ],
  },
  {
    title: 'Студентська рада',
    icon: 'people-outline',
    color: '#E76F51',
    data: [
      { id: '8', name: 'Гриценко Дмитро', role: 'голова студентської ради', phone: '+380 98 111-22-33', avatar: 'ГД' },
      { id: '9', name: 'Лисенко Аліна', role: 'заступник голови', phone: '+380 97 222-33-44', avatar: 'ЛА' },
      { id: '10', name: 'Тимченко Роман', role: 'відповідальний за культуру', phone: '+380 96 333-44-55', avatar: 'ТР' },
    ],
  },
  {
    title: 'Технічна підтримка',
    icon: 'construct-outline',
    color: '#457B9D',
    data: [
      { id: '11', name: 'Гаврилюк Олексій', role: 'системний адміністратор', phone: '+380 50 444-55-66', avatar: 'ГО' },
      { id: '12', name: 'Мороз Катерина', role: 'спеціаліст IT-відділу', phone: '+380 63 555-66-77', avatar: 'МК' },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ section }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIconWrap, { backgroundColor: section.color + '22' }]}>
        <Ionicons name={section.icon} size={16} color={section.color} />
      </View>
      <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length}</Text>
    </View>
  );
}

function ContactItem({ item, sectionColor }) {
  return (
    <TouchableOpacity style={styles.contactItem} activeOpacity={0.75}>
      {/* Avatar circle with initials */}
      <View style={[styles.avatar, { backgroundColor: sectionColor + '22', borderColor: sectionColor + '44' }]}>
        <Text style={[styles.avatarText, { color: sectionColor }]}>{item.avatar}</Text>
      </View>

      {/* Info */}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactRole}>{item.role}</Text>
      </View>

      {/* Phone */}
      <View style={styles.phoneWrap}>
        <Ionicons name="call-outline" size={13} color="#9999bb" style={{ marginBottom: 2 }} />
        <Text style={styles.phoneText}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ItemSeparator() {
  return <View style={styles.itemSeparator} />;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ContactsScreen() {
  return (
    <View style={styles.container}>
      <SectionList
        sections={CONTACTS_SECTIONS}

        keyExtractor={(item) => item.id}

        renderItem={({ item, section }) => (
          <ContactItem item={item} sectionColor={section.color} />
        )}

        renderSectionHeader={({ section }) => (
          <SectionHeader section={section} />
        )}

        ItemSeparatorComponent={ItemSeparator}

        stickySectionHeadersEnabled={true}

        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Контакти</Text>
            <Text style={styles.listHeaderSub}>Список контактів університету</Text>
          </View>
        }

        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEF4',
  },
  listContent: {
    paddingBottom: 24,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  listHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: 0.3,
  },
  listHeaderSub: {
    fontSize: 12,
    color: '#9999bb',
    marginTop: 2,
    marginBottom: 8,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEF4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0ec',
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionCount: {
    fontSize: 12,
    color: '#9999bb',
    fontWeight: '600',
    backgroundColor: '#e0e0ec',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  // Contact item
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  contactRole: {
    fontSize: 12,
    color: '#8888aa',
    fontStyle: 'italic',
  },
  phoneWrap: {
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 11,
    color: '#9999bb',
    fontWeight: '500',
  },

  // Separator
  itemSeparator: {
    height: 1,
    backgroundColor: '#f0f0f8',
    marginLeft: 72,
  },
});
