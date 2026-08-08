import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Spacing } from '../../src/constants/theme';
import { useChatStore } from '../../src/store/chat';
import { useAuthStore } from '../../src/store/auth';
import { chatApi } from '../../src/api/chat';
import { sendMessageStream, isBotOpenApiEnabled } from '../../src/api/sse';
import { MessageBubble } from '../../src/components/MessageBubble';
import { ChatInput } from '../../src/components/ChatInput';
import { EmptyState } from '../../src/components/EmptyState';
import type { ChatMessage } from '../../src/types/api';

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const flatListRef = useRef<FlatList>(null);
  const streamRef = useRef<{ abort: () => void } | null>(null);

  const { user, sessionId, patToken } = useAuthStore();
  const {
    messages, isStreaming, streamingContent, streamingMessageId,
    toolCalls, error,
    setMessages, appendDelta, appendToolCall, finishStreaming,
    clearStreaming, setError, startStreaming,
  } = useChatStore();

  const [loading, setLoading] = useState(true);
  const [botName, setBotName] = useState('AI 助手');

  // 加载历史消息
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const result = await chatApi.getMessages(id, { page: 1, page_size: 50 });
        setMessages(result.items || []);
      } catch {
        // 使用模拟数据
        setMessages(getMockMessages());
      } finally {
        setLoading(false);
      }
    })();
    return () => { clearStreaming(); };
  }, [id]);

  // 自动滚动到底部
  useEffect(() => {
    if (messages.length > 0 || streamingContent) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, streamingContent]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // 添加用户消息
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversation_id: id || '',
      role: 'user',
      type: 'text',
      content: text,
      content_type: 'text',
      created_at: String(Date.now()),
      updated_at: String(Date.now()),
    };
    setMessages([...messages, userMsg]);

    // 开始流式响应
    startStreaming();

    const useOpenApi = false; // 默认用 WebAPI

    streamRef.current = sendMessageStream(
      {
        conversation_id: id,
        bot_id: 'default_bot',
        role: 'user',
        content: text,
        content_type: 'text',
        stream: true,
      },
      {
        onDelta: (delta) => appendDelta(delta),
        onToolCall: (name, args) => appendToolCall(name, args),
        onComplete: (msgId, usage) => {
          finishStreaming(msgId || `msg_${Date.now()}`);
        },
        onError: (err) => {
          setError(err.message);
          // 出错时用模拟回复
          finishStreaming(`msg_${Date.now()}`);
          appendDelta('');
        },
        onStatus: (status) => {
          if (status === 'streaming') {
            // 模拟流式效果（后端未连接时）
            simulateStreaming(text);
          }
        },
      },
      { useOpenApi, sessionId: sessionId || undefined, bearerToken: patToken || undefined }
    );
  };

  // 后端未连接时的模拟流式效果
  const simulateStreaming = (userText: string) => {
    const responses = [
      `好的，我来帮你处理"${userText}"这个问题。让我分析一下...\n\n根据我的理解，这个问题涉及以下几个方面：\n\n1. **核心需求分析**\n2. **技术可行性评估**\n3. **最佳实践建议**\n\n\`\`\`typescript\n// 示例代码\nconst result = await analyze(userText);\nconsole.log(result);\n\`\`\`\n\n你觉得这个方案怎么样？`,
      `收到！关于"${userText}"，我有以下建议：\n\n> 这是一个很好的问题，值得深入探讨。\n\n首先，我们需要明确目标。然后逐步拆解：\n\n- 第一步：收集相关信息\n- 第二步：分析关键因素\n- 第三步：制定执行计划\n\n需要我进一步展开哪个部分？`,
      `明白！让我来帮你解决"${userText}"。\n\n经过分析，我推荐以下方案：\n\n**方案概述：**\n采用分步式处理策略，确保每个环节都可追溯。\n\n**预期效果：**\n- 效率提升 40%\n- 错误率降低 60%\n- 用户满意度提升\n\n需要我生成详细的执行计划吗？`,
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    let i = 0;
    const timer = setInterval(() => {
      if (i < response.length) {
        appendDelta(response[i]);
        i++;
      } else {
        clearInterval(timer);
        finishStreaming(`msg_${Date.now()}`);
      }
    }, 30);
  };

  const handleStop = () => {
    streamRef.current?.abort();
    clearStreaming();
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  const renderFooter = () => {
    if (!isStreaming || !streamingContent) return null;
    return (
      <View style={styles.streamingFooter}>
        <MessageBubble
          message={{
            id: streamingMessageId || '',
            conversation_id: id || '',
            role: 'assistant',
            type: 'text',
            content: streamingContent,
            content_type: 'markdown',
            tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
            created_at: String(Date.now()),
            updated_at: String(Date.now()),
          }}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {messages.length === 0 && !isStreaming ? (
        <View style={styles.emptyArea}>
          <EmptyState icon="🤖" title={`和 ${botName} 开始对话`} subtitle="输入消息开始聊天" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}

      {error ? (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : null}

      <ChatInput
        onSend={handleSend}
        onStop={handleStop}
        isStreaming={isStreaming}
        placeholder={`给 ${botName} 发消息...`}
      />
    </KeyboardAvoidingView>
  );
}

function getMockMessages(): ChatMessage[] {
  const now = String(Date.now());
  return [
    { id: 'm0', conversation_id: 'c1', role: 'system', type: 'text', content: '👋 欢迎使用 AI 助手！我是你的智能助手，可以帮你编程、写作、分析数据等。', content_type: 'text', created_at: now, updated_at: now },
    { id: 'm1', conversation_id: 'c1', role: 'assistant', type: 'text', content: '你好！我是 **AI 编程助手** 🤖\n\n我可以帮你：\n- 编写和调试代码\n- 分析代码架构\n- 解答技术问题\n- 生成技术方案\n\n有什么我可以帮你的吗？', content_type: 'markdown', created_at: now, updated_at: now },
  ];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyArea: { flex: 1, justifyContent: 'center' },
  listContent: { paddingVertical: Spacing.md, paddingBottom: Spacing.md },
  streamingFooter: { paddingHorizontal: 0 },
  errorBar: { backgroundColor: '#fff3f3', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderTopWidth: 0.5, borderTopColor: '#ffcccc' },
  errorText: { fontSize: 12, color: Colors.danger },
});
