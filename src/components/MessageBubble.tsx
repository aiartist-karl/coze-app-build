import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../constants/theme';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { ChatMessage, ToolCall } from '../types/api';

interface MessageBubbleProps {
  message: ChatMessage;
  isDark?: boolean;
}

/**
 * 工具调用卡片
 */
const ToolCallCard: React.FC<{ toolCall: ToolCall; isDark?: boolean }> = ({ toolCall, isDark }) => {
  let argsDisplay = toolCall.function.arguments;
  try {
    argsDisplay = JSON.stringify(JSON.parse(toolCall.function.arguments), null, 2);
  } catch {}
  return (
    <View style={[styles.toolCard, { backgroundColor: isDark ? '#2a2a3a' : '#f0f4ff', borderColor: isDark ? '#3a3a5a' : '#d0d8ff' }]}>
      <View style={styles.toolHeader}>
        <Text style={[styles.toolIcon]}>🔧</Text>
        <Text style={[styles.toolName, { color: Colors.primary }]}>{toolCall.function.name}</Text>
      </View>
      <Text style={[styles.toolArgs, { color: isDark ? '#aaa' : Colors.textSecondary }]} numberOfLines={3}>{argsDisplay}</Text>
    </View>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isDark }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isTool = message.role === 'tool';

  if (isSystem) {
    return (
      <View style={styles.systemContainer}>
        <Text style={[styles.systemText, { color: isDark ? '#666' : Colors.textLight }]}>
          {message.content}
        </Text>
      </View>
    );
  }

  if (isTool) {
    return (
      <View style={styles.toolResultContainer}>
        <Text style={[styles.toolResultLabel, { color: Colors.success }]}>✅ 工具返回</Text>
        <Text style={[styles.toolResultText, { color: isDark ? '#ccc' : Colors.text }]} numberOfLines={5}>
          {message.content}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.row, isUser ? styles.userRow : styles.assistantRow]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      )}
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
        { backgroundColor: isUser ? Colors.bubbleUser : (isDark ? Colors.bubbleAssistantDark : Colors.bubbleAssistant) },
      ]}>
        {message.content_type === 'image_url' && message.content ? (
          <Image source={{ uri: message.content }} style={styles.messageImage} />
        ) : (
          <MarkdownRenderer content={message.content} isDark={isDark} />
        )}
        {message.tool_calls?.map((tc, idx) => (
          <ToolCallCard key={idx} toolCall={tc} isDark={isDark} />
        ))}
      </View>
      {isUser && (
        <View style={[styles.avatar, { backgroundColor: Colors.tertiary }]}>
          <Text style={styles.avatarText}>我</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: Spacing.xs, paddingHorizontal: Spacing.md, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginHorizontal: Spacing.xs },
  avatarText: { color: '#fff', fontSize: FontSize.xs, fontWeight: '600' },
  bubble: { maxWidth: '75%', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg },
  userBubble: { borderBottomRightRadius: BorderRadius.sm },
  assistantBubble: { borderBottomLeftRadius: BorderRadius.sm },
  messageImage: { width: 200, height: 200, borderRadius: BorderRadius.md, marginTop: Spacing.xs },
  systemContainer: { alignItems: 'center', marginVertical: Spacing.sm },
  systemText: { fontSize: FontSize.xs, textAlign: 'center' },
  toolCard: { borderRadius: BorderRadius.md, padding: Spacing.sm, marginTop: Spacing.xs, borderWidth: 1 },
  toolHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  toolIcon: { fontSize: FontSize.sm, marginRight: Spacing.xs },
  toolName: { fontSize: FontSize.sm, fontWeight: '600' },
  toolArgs: { fontSize: FontSize.xs, fontFamily: 'monospace' },
  toolResultContainer: { marginVertical: Spacing.xs, paddingHorizontal: Spacing.md },
  toolResultLabel: { fontSize: FontSize.xs, fontWeight: '600', marginBottom: Spacing.xs },
  toolResultText: { fontSize: FontSize.sm },
});
