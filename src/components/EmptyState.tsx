import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize } from '../constants/theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  isDark?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = '', title, subtitle, isDark }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={[styles.title, { color: isDark ? Colors.textInverse : Colors.text }]}>{title}</Text>
    {subtitle ? <Text style={[styles.subtitle, { color: isDark ? '#888' : Colors.textSecondary }]}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  icon: { fontSize: 48, marginBottom: Spacing.md },
  title: { fontSize: FontSize.lg, fontWeight: '600', marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, textAlign: 'center' },
});
