import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';

const MENU_GROUPS = [
  {
    title: '创作',
    items: [
      { icon: '📚', label: '我的知识库', desc: '管理文档和知识切片' },
      { icon: '⚡', label: '工作流', desc: '可视化流程编排' },
      { icon: '🔌', label: '我的插件', desc: '自定义插件管理' },
      { icon: '🤖', label: '我的 Agent', desc: '创建和管理 Agent' },
    ],
  },
  {
    title: '自动化',
    items: [
      { icon: '⏰', label: '定时任务', desc: 'Agent 自动化执行' },
      { icon: '🔗', label: 'Webhook', desc: '外部触发器管理' },
    ],
  },
  {
    title: '设置',
    items: [
      { icon: '⚙️', label: '应用设置', desc: '通用配置' },
      { icon: '', label: '外观', desc: '暗色/亮色模式' },
      { icon: '🔔', label: '通知设置', desc: '推送通知管理' },
      { icon: '❓', label: '帮助与反馈', desc: '使用帮助' },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '退出', style: 'destructive', onPress: async () => { await logout(); router.replace('/login'); } },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 用户信息 */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || '未登录'}</Text>
          <Text style={styles.userEmail}>{user?.email || user?.mobile || '未设置'}</Text>
        </View>
      </View>

      {/* 资产概览 */}
      <View style={styles.statsRow}>
        {[
          { label: '项目', value: '3' },
          { label: 'Agent', value: '5' },
          { label: '知识库', value: '2' },
          { label: '插件', value: '4' },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* 菜单组 */}
      {MENU_GROUPS.map((group) => (
        <View key={group.title} style={styles.menuGroup}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.items.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={() => Alert.alert(item.label, `${item.desc}（开发中）`)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* 退出登录 */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, backgroundColor: '#fff' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  avatarText: { color: '#fff', fontSize: FontSize.xl, fontWeight: '600' },
  userInfo: { flex: 1 },
  userName: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text },
  userEmail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: Spacing.md, marginTop: Spacing.sm },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: Spacing.xs },
  menuGroup: { backgroundColor: '#fff', marginTop: Spacing.sm, paddingHorizontal: Spacing.md },
  groupTitle: { fontSize: FontSize.sm, color: Colors.textLight, fontWeight: '500', paddingVertical: Spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' },
  menuIcon: { fontSize: 22, marginRight: Spacing.md },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: FontSize.md, color: Colors.text, fontWeight: '500' },
  menuDesc: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },
  menuArrow: { fontSize: FontSize.xl, color: '#ccc' },
  logoutBtn: { margin: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.danger, alignItems: 'center' },
  logoutText: { color: Colors.danger, fontSize: FontSize.md, fontWeight: '500' },
});
