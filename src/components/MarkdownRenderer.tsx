import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../constants/theme';

interface MarkdownRendererProps {
  content: string;
  isDark?: boolean;
}

/**
 * 简易 Markdown 渲染器
 * 支持：标题、粗体、斜体、代码块、行内代码、列表、引用、链接
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isDark }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';
  let inList = false;

  const textColor = isDark ? Colors.textInverse : Colors.text;
  const codeBg = isDark ? '#1e1e1e' : '#f5f5f5';

  const renderInline = (text: string, key: string): React.ReactNode => {
    // 行内代码
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <Text key={`${key}-code-${i}`} style={[styles.inlineCode, { backgroundColor: codeBg, color: isDark ? '#d4d4d4' : '#e01e5a' }]}>
            {part.slice(1, -1)}
          </Text>
        );
      }
      // 粗体
      let result: React.ReactNode = part;
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      if (boldParts.length > 1) {
        result = boldParts.map((bp, j) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <Text key={`${key}-b-${j}`} style={{ fontWeight: '700' }}>{bp.slice(2, -2)}</Text>;
          }
          // 斜体
          const italicParts = bp.split(/(\*[^*]+\*)/g);
          if (italicParts.length > 1) {
            return italicParts.map((ip, k) => {
              if (ip.startsWith('*') && ip.endsWith('*')) {
                return <Text key={`${key}-i-${j}-${k}`} style={{ fontStyle: 'italic' }}>{ip.slice(1, -1)}</Text>;
              }
              return <Text key={`${key}-t-${j}-${k}`}>{ip}</Text>;
            });
          }
          return <Text key={`${key}-t-${j}`}>{bp}</Text>;
        });
      }
      return <React.Fragment key={`${key}-${i}`}>{result}</React.Fragment>;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 代码块
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeContent = '';
      } else {
        inCodeBlock = false;
        elements.push(
          <View key={`code-${i}`} style={[styles.codeBlock, { backgroundColor: codeBg }]}>
            {codeLang ? <Text style={[styles.codeLang, { color: isDark ? '#9b9b9b' : Colors.textSecondary }]}>{codeLang}</Text> : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={[styles.codeText, { color: isDark ? '#dcdcdc' : '#333' }]} selectable>{codeContent}</Text>
            </ScrollView>
          </View>
        );
      }
      continue;
    }
    if (inCodeBlock) {
      codeContent += (codeContent ? '\n' : '') + line;
      continue;
    }

    // 空行
    if (line.trim() === '') {
      elements.push(<View key={`sp-${i}`} style={{ height: Spacing.sm }} />);
      continue;
    }

    // 标题
    if (line.startsWith('### ')) {
      elements.push(<Text key={`h3-${i}`} style={[styles.h3, { color: textColor }]}>{renderInline(line.slice(4), `h3-${i}`)}</Text>);
    } else if (line.startsWith('## ')) {
      elements.push(<Text key={`h2-${i}`} style={[styles.h2, { color: textColor }]}>{renderInline(line.slice(3), `h2-${i}`)}</Text>);
    } else if (line.startsWith('# ')) {
      elements.push(<Text key={`h1-${i}`} style={[styles.h1, { color: textColor }]}>{renderInline(line.slice(2), `h1-${i}`)}</Text>);
    }
    // 引用
    else if (line.startsWith('> ')) {
      elements.push(
        <View key={`q-${i}`} style={[styles.quote, { borderLeftColor: Colors.primary }]}>
          <Text style={[styles.quoteText, { color: isDark ? '#999' : Colors.textSecondary }]}>{renderInline(line.slice(2), `q-${i}`)}</Text>
        </View>
      );
    }
    // 无序列表
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) { inList = true; }
      elements.push(
        <View key={`li-${i}`} style={styles.listItem}>
          <Text style={{ color: textColor, fontSize: FontSize.md }}>• </Text>
          <Text style={{ color: textColor, fontSize: FontSize.md, flex: 1 }}>{renderInline(line.slice(2), `li-${i}`)}</Text>
        </View>
      );
    }
    // 有序列表
    else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        elements.push(
          <View key={`ol-${i}`} style={styles.listItem}>
            <Text style={{ color: Colors.primary, fontSize: FontSize.md, fontWeight: '600', width: 24 }}>{match[1]}.</Text>
            <Text style={{ color: textColor, fontSize: FontSize.md, flex: 1 }}>{renderInline(match[2], `ol-${i}`)}</Text>
          </View>
        );
      }
    }
    // 普通文本
    else {
      inList = false;
      elements.push(<Text key={`p-${i}`} style={[styles.paragraph, { color: textColor }]}>{renderInline(line, `p-${i}`)}</Text>);
    }
  }

  return <View style={styles.container}>{elements}</View>;
};

const styles = StyleSheet.create({
  container: { paddingVertical: Spacing.xs },
  h1: { fontSize: FontSize.xxl, fontWeight: '700', marginBottom: Spacing.sm },
  h2: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.sm },
  h3: { fontSize: FontSize.lg, fontWeight: '600', marginBottom: Spacing.xs },
  paragraph: { fontSize: FontSize.md, lineHeight: FontSize.md * 1.6, marginBottom: Spacing.xs },
  codeBlock: { borderRadius: BorderRadius.md, padding: Spacing.md, marginVertical: Spacing.sm },
  codeLang: { fontSize: FontSize.xs, marginBottom: Spacing.xs, fontFamily: 'monospace' },
  codeText: { fontSize: FontSize.sm, fontFamily: 'monospace', lineHeight: FontSize.sm * 1.5 },
  inlineCode: { paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: BorderRadius.sm, fontSize: FontSize.sm * 0.9, fontFamily: 'monospace' },
  quote: { borderLeftWidth: 3, paddingLeft: Spacing.md, marginVertical: Spacing.xs },
  quoteText: { fontSize: FontSize.md, fontStyle: 'italic' },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.xs },
});
