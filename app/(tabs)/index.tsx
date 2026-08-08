import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';
import { projectApi } from '../../src/api/project';
import { EmptyState } from '../../src/components/EmptyState';
import type { ProjectInfo } from '../../src/types/api';

const PROJECT_TYPES = [
  { key: 'all', label: '全部' },
  { key: 'chat', label: '对话' },
  { key: 'code', label: '编程' },
  { key: 'video', label: '视频' },
  { key: 'general', label: '通用' },
];

const TYPE_ICONS: Record<string, string> = { chat: '', code: '💻', video: '', general: '📋' };
const TYPE_COLORS: Record<string, string> = { chat: '#0054e9', code: '#6030ff', video: '#e040fb', general: '#2dd55b' };

export default function ProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [activeType, setActiveType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const params: any = { page: 1, page_size: 50 };
      if (activeType !== 'all') params.project_type = activeType;
      const result = await projectApi.list(params);
      setProjects(result.items || []);
    } catch (e) {
      // 后端未连接时使用模拟数据
      setProjects(getMockProjects());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [activeType]);

  const renderProject = ({ item }: { item: ProjectInfo }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={[styles.projectIcon, { backgroundColor: TYPE_COLORS[item.project_type] || Colors.primary }]}>
        <Text style={styles.projectIconText}>{TYPE_ICONS[item.project_type] || '📋'}</Text>
      </View>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.projectDesc} numberOfLines={2}>{item.description || '暂无描述'}</Text>
        <View style={styles.projectMeta}>
          <Text style={styles.projectMetaText}>{item.bot_ids?.length || 0} 个 Agent</Text>
          <Text style={styles.projectMetaText}>·</Text>
          <Text style={styles.projectMetaText}>{item.member_ids?.length || 0} 位成员</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 类型筛选 */}
      <View style={styles.filterRow}>
        {PROJECT_TYPES.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.filterChip, activeType === t.key && styles.filterChipActive]}
            onPress={() => setActiveType(t.key)}
          >
            <Text style={[styles.filterChipText, activeType === t.key && styles.filterChipTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 项目列表 */}
      {projects.length === 0 && !loading ? (
        <EmptyState icon="📁" title="还没有项目" subtitle="点击右下角按钮创建第一个项目" />
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProjects(); }} />}
        />
      )}

      {/* FAB 新建项目 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // 快速创建演示
          const newProject: ProjectInfo = {
            id: `proj_${Date.now()}`,
            name: '新项目',
            description: '',
            project_type: 'general',
            bot_ids: [],
            member_ids: [],
            workspace_id: '1',
            owner_id: '1',
            status: 'active',
            created_at: String(Date.now()),
            updated_at: String(Date.now()),
          };
          setProjects((prev) => [newProject, ...prev]);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function getMockProjects(): ProjectInfo[] {
  return [
    { id: '1', name: 'AI 编程助手', description: '基于 DeepSeek 的代码生成和调试助手', project_type: 'code', bot_ids: ['b1', 'b2'], member_ids: ['u1'], workspace_id: '1', owner_id: '1', status: 'active', created_at: String(Date.now()), updated_at: String(Date.now()) },
    { id: '2', name: '自媒体内容工厂', description: '自动生成小红书/公众号文案', project_type: 'chat', bot_ids: ['b3'], member_ids: ['u1', 'u2'], workspace_id: '1', owner_id: '1', status: 'active', created_at: String(Date.now()), updated_at: String(Date.now()) },
    { id: '3', name: '视频创作工作流', description: '从剧本到分镜到成片的自动化流程', project_type: 'video', bot_ids: ['b4', 'b5'], member_ids: ['u1'], workspace_id: '1', owner_id: '1', status: 'active', created_at: String(Date.now()), updated_at: String(Date.now()) },
  ];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: '#f0f0f0' },
  filterChipActive: { backgroundColor: Colors.primary },
  filterChipText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: Spacing.md, paddingBottom: 80 },
  projectCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  projectIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  projectIconText: { fontSize: 22 },
  projectInfo: { flex: 1 },
  projectName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: Spacing.xs },
  projectDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: FontSize.sm * 1.4 },
  projectMeta: { flexDirection: 'row', marginTop: Spacing.xs, gap: Spacing.xs },
  projectMetaText: { fontSize: FontSize.xs, color: Colors.textLight },
  fab: { position: 'absolute', right: Spacing.lg, bottom: Spacing.xl, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', marginTop: -2 },
});
