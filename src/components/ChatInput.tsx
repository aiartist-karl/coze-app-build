import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../constants/theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  isDark?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onStop, isStreaming, isDark, placeholder }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setText('');
  };

  const bgColor = isDark ? Colors.surfaceDark : '#fff';
  const borderColor = isDark ? Colors.borderDark : Colors.border;
  const inputColor = isDark ? Colors.textInverse : Colors.text;

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderTopColor: borderColor }]}>
      <View style={[styles.inputRow, { borderColor }]}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: inputColor }]}
          value={text}
          onChangeText={setText}
          placeholder={placeholder || '输入消息...'}
          placeholderTextColor={isDark ? '#666' : Colors.textLight}
          multiline
          maxLength={10000}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          editable={!isStreaming}
        />
        {isStreaming ? (
          <TouchableOpacity style={[styles.stopBtn, { backgroundColor: Colors.danger }]} onPress={onStop}>
            <Text style={styles.stopBtnText}>停止</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: text.trim() ? Colors.primary : (isDark ? '#444' : '#ddd') }]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Text style={[styles.sendBtnText, { color: text.trim() ? '#fff' : (isDark ? '#888' : '#999') }]}>↑</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderTopWidth: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', borderWidth: 1, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  input: { flex: 1, fontSize: FontSize.md, minHeight: 36, maxHeight: 120, textAlignVertical: 'center' },
  sendBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: Spacing.xs },
  sendBtnText: { fontSize: FontSize.lg, fontWeight: '700' },
  stopBtn: { paddingHorizontal: Spacing.md, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: Spacing.xs },
  stopBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '600' },
});
