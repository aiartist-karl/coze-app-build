import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';
import { chatApi } from '../../src/api/chat';
import { EmptyState } from '../../src/components/EmptyState';
import type { ConversationInfo } from '../../src/types/api';
import dayjs from 'dayjs';

export default function ChatListScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversations = async () => {
    try {
      const result = await chatApi.listConversations({ page: 1, page_size: 50 });
      setConversations(result.items || []);
    } catch {
      setConversations(getMockConversations());
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchConversations(); }, []);

  const filtered = conversations.filter((c) =>
    !searchText || c.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderConversation = ({ item }: { item: ConversationInfo }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>💬</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{item.name || '未命名对话'}</Text>
        <Text style={styles.lastMsg} numberOfLines={1}>
          {item.last_message?.content || '暂无消息'}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>
          {dayjs(Number(item.updated_at)).format('MM/DD HH:mm')}
        </Text>
        {item.message_count ? (
          <Text style={styles.count}>{item.message_count} 条</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 搜索 */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索对话..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState icon="💬" title="还没有对话" subtitle="选择一个 Agent 开始聊天" />
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchConversations(); }} />}
        />
      )}

      {/* FAB 新建对话 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/agents')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function getMockConversations(): ConversationInfo[] {
  const now = Date.now();
  return [
    { id: 'c1', bot_id: 'b1', name: 'AI 编程助手对话', last_message: { id: 'm1', conversation_id: 'c1', role: 'assistant', type: 'text', content: '好的，我来帮你分析这段代码...', created_at: String(now), updated_at: String(now) }, message_count: 12, workspace_id: '1', user_id: '1', created_at: String(now - 86400000), updated_at: String(now) },
    { id: 'c2', bot_id: 'b2', name: '自媒体文案生成', last_message: { id: 'm2', conversation_id: 'c2', role: 'assistant', type: 'text', content: '这是一篇关于科技趋势的小红书文案...', created_at: String(now), updated_at: String(now) }, message_count: 8, workspace_id: '1', user_id: '1', created_at: String(now - 172800000), updated_at: String(now - 3600000) },
    { id: 'c3', bot_id: 'b3', name: '视频剧本创作', last_message: { id: 'm3', conversation_id: 'c3', role: 'user', type: 'text', content: '帮我写一个3分钟的短视频脚本', created_at: String(now), updated_at: String(now) }, message_count: 5, workspace_id: '1', user_id: '1', created_at: String(now - 259200000), updated_at: String(now - 7200000) },
  ];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBar: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  searchInput: { height: 36, backgroundColor: '#f5f5f5', borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, fontSize: FontSize.sm },
  item: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  avatarText: { fontSize: 20 },
  content: { flex: 1 },
  name: { fontSize: FontSize.md, fontWeight: '500', color: Colors.text, marginBottom: Spacing.xs },
  lastMsg: { fontSize: FontSize.sm, color: Colors.textSecondary },
  meta: { alignItems: 'flex-end', justifyContent: 'space-between' },
  time: { fontSize: FontSize.xs, color: Colors.textLight },
  count: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: Spacing.xs },
  fab: { position: 'absolute', right: Spacing.lg, bottom: Spacing.xl, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', marginTop: -2 },
});
