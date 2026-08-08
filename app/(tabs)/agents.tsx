import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, RefreshControl } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';
import { marketApi } from '../../src/api/market';
import { EmptyState } from '../../src/components/EmptyState';
import type { MarketAgentItem, MarketCategory } from '../../src/types/api';

const CATEGORIES = ['全部', '编程', '自媒体', '教育', '法律', '金融', '医疗', '设计', '效率'];

export default function AgentsScreen() {
  const [agents, setAgents] = useState<MarketAgentItem[]>([]);
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAgents = async () => {
    try {
      const params: any = { page: 1, page_size: 50 };
      if (activeCategory !== '全部') params.category = activeCategory;
      if (searchText) params.keyword = searchText;
      const result = await marketApi.agents(params);
      setAgents(result.items || []);
    } catch {
      setAgents(getMockAgents());
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAgents(); }, [activeCategory]);

  const renderAgent = ({ item }: { item: MarketAgentItem }) => (
    <TouchableOpacity style={styles.agentCard}>
      <View style={styles.agentAvatar}>
        <Text style={styles.agentAvatarText}>{item.is_official ? '⭐' : '🤖'}</Text>
      </View>
      <View style={styles.agentInfo}>
        <View style={styles.agentHeader}>
          <Text style={styles.agentName} numberOfLines={1}>{item.name}</Text>
          {item.is_official && <Text style={styles.officialTag}>官方</Text>}
        </View>
        <Text style={styles.agentDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.agentMeta}>
          <Text style={styles.agentMetaText}>⭐ {item.rating?.toFixed(1) || '4.8'}</Text>
          <Text style={styles.agentMetaText}>·</Text>
          <Text style={styles.agentMetaText}>{item.use_count || 0} 次使用</Text>
          <Text style={styles.agentMetaText}>·</Text>
          <Text style={styles.agentMetaText}>{item.star_count || 0} 收藏</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.useBtn}>
        <Text style={styles.useBtnText}>使用</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 搜索 */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索 Agent..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(t) => { setSearchText(t); }}
          onSubmitEditing={fetchAgents}
        />
      </View>

      {/* 分类 */}
      <FlatList
        horizontal
        data={CATEGORIES}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, activeCategory === item && styles.catChipActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.catText, activeCategory === item && styles.catTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
      />

      {/* Agent 列表 */}
      {agents.length === 0 ? (
        <EmptyState icon="🤖" title="暂无 Agent" subtitle="试试其他分类或关键词" />
      ) : (
        <FlatList
          data={agents}
          renderItem={renderAgent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAgents(); }} />}
        />
      )}
    </View>
  );
}

function getMockAgents(): MarketAgentItem[] {
  return [
    { id: 'a1', name: '代码专家', description: '精通 Python/Java/Go/TS，擅长代码审查、Bug 修复和架构设计', categories: ['编程'], author: 'Coze Official', star_count: 12800, use_count: 89000, rating: 4.9, tags: ['编程', '代码审查'], is_official: true, published_at: String(Date.now()) },
    { id: 'a2', name: '小红书文案助手', description: '自动生成爆款小红书文案，支持多种风格和话题', categories: ['自媒体'], author: 'Coze Official', star_count: 8900, use_count: 56000, rating: 4.8, tags: ['文案', '自媒体'], is_official: true, published_at: String(Date.now()) },
    { id: 'a3', name: '法律问答', description: '基于最新法律法规的专业法律咨询助手', categories: ['法律'], author: 'LawBot', star_count: 5600, use_count: 23000, rating: 4.7, tags: ['法律', '咨询'], is_official: false, published_at: String(Date.now()) },
    { id: 'a4', name: '数据分析师', description: '数据可视化、统计分析、报表生成一体化', categories: ['效率'], author: 'DataPro', star_count: 4200, use_count: 18000, rating: 4.6, tags: ['数据', '分析'], is_official: false, published_at: String(Date.now()) },
    { id: 'a5', name: '英语私教', description: '一对一英语口语练习，智能纠错和发音指导', categories: ['教育'], author: 'EduAI', star_count: 7100, use_count: 34000, rating: 4.8, tags: ['英语', '教育'], is_official: false, published_at: String(Date.now()) },
    { id: 'a6', name: 'UI 设计顾问', description: '提供 UI/UX 设计建议，生成设计规范和配色方案', categories: ['设计'], author: 'DesignAI', star_count: 3800, use_count: 15000, rating: 4.5, tags: ['设计', 'UI'], is_official: false, published_at: String(Date.now()) },
  ];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBar: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  searchInput: { height: 36, backgroundColor: '#f5f5f5', borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, fontSize: FontSize.sm },
  catRow: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm },
  catChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: '#f0f0f0' },
  catChipActive: { backgroundColor: Colors.primary },
  catText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  catTextActive: { color: '#fff', fontWeight: '500' },
  list: { padding: Spacing.md },
  agentCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 0.5, borderColor: '#eee' },
  agentAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  agentAvatarText: { fontSize: 20 },
  agentInfo: { flex: 1 },
  agentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  agentName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, flex: 1 },
  officialTag: { fontSize: FontSize.xs, color: Colors.primary, backgroundColor: '#f0f4ff', paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: BorderRadius.sm, marginLeft: Spacing.xs },
  agentDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: FontSize.sm * 1.4, marginBottom: Spacing.xs },
  agentMeta: { flexDirection: 'row', gap: Spacing.xs },
  agentMetaText: { fontSize: FontSize.xs, color: Colors.textLight },
  useBtn: { justifyContent: 'center', paddingHorizontal: Spacing.md },
  useBtnText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
});
