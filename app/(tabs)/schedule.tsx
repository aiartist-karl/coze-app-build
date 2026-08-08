import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';
import { EmptyState } from '../../src/components/EmptyState';

interface ScheduleItem {
  id: string;
  title: string;
  agent: string;
  time: string;
  status: 'pending' | 'running' | 'done' | 'failed';
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: '待执行', color: Colors.warning },
  running: { label: '执行中', color: Colors.primary },
  done: { label: '已完成', color: Colors.success },
  failed: { label: '失败', color: Colors.danger },
};

export default function ScheduleScreen() {
  const [schedules] = useState<ScheduleItem[]>(getMockSchedules());

  const renderItem = ({ item }: { item: ScheduleItem }) => {
    const statusCfg = STATUS_CONFIG[item.status];
    return (
      <View style={styles.item}>
        <View style={styles.timeCol}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.contentCol}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.agent}>🤖 {item.agent}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.color + '18' }]}>
          <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {schedules.length === 0 ? (
        <EmptyState icon="" title="暂无日程" subtitle="Agent 定时任务会显示在这里" />
      ) : (
        <FlatList
          data={schedules}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

function getMockSchedules(): ScheduleItem[] {
  return [
    { id: 's1', title: '每日行业简报生成', agent: '新闻助手', time: '每天 08:00', status: 'done' },
    { id: 's2', title: '周报自动汇总', agent: '效率助手', time: '每周五 17:00', status: 'pending' },
    { id: 's3', title: '竞品监控报告', agent: '市场分析师', time: '每周一 09:00', status: 'running' },
    { id: 's4', title: '代码质量检查', agent: '代码专家', time: '每天 22:00', status: 'done' },
  ];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  list: { padding: Spacing.md },
  item: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, alignItems: 'center' },
  timeCol: { width: 80, marginRight: Spacing.md },
  timeText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  contentCol: { flex: 1 },
  title: { fontSize: FontSize.md, fontWeight: '500', color: Colors.text, marginBottom: Spacing.xs },
  agent: { fontSize: FontSize.sm, color: Colors.textSecondary },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: '500' },
});
