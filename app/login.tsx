import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/auth';
import { Colors, Spacing, BorderRadius, FontSize } from '../src/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [tab, setTab] = useState<'password' | 'code'>('password');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = () => {
    if (!account.trim()) { Alert.alert('提示', '请输入手机号或邮箱'); return; }
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    Alert.alert('提示', '验证码已发送（演示）');
  };

  const handleLogin = async () => {
    if (!account.trim() || !password.trim()) {
      Alert.alert('提示', '请输入账号和密码');
      return;
    }
    try {
      await login(account, password, tab === 'password' ? 'password' : 'sms_code', code || undefined);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('登录失败', error.message || '请检查账号密码');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>C</Text>
          </View>
          <Text style={styles.title}>Coze App</Text>
          <Text style={styles.subtitle}>AI 智能助手平台</Text>
        </View>

        {/* Tab 切换 */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tab, tab === 'password' && styles.tabActive]} onPress={() => setTab('password')}>
            <Text style={[styles.tabText, tab === 'password' && styles.tabTextActive]}>密码登录</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'code' && styles.tabActive]} onPress={() => setTab('code')}>
            <Text style={[styles.tabText, tab === 'code' && styles.tabTextActive]}>验证码登录</Text>
          </TouchableOpacity>
        </View>

        {/* 表单 */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="手机号 / 邮箱"
            placeholderTextColor="#999"
            value={account}
            onChangeText={setAccount}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {tab === 'password' ? (
            <TextInput
              style={styles.input}
              placeholder="密码"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          ) : (
            <View style={styles.codeRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="验证码"
                placeholderTextColor="#999"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.codeBtn, countdown > 0 && styles.codeBtnDisabled]}
                onPress={handleSendCode}
                disabled={countdown > 0}
              >
                <Text style={styles.codeBtnText}>{countdown > 0 ? `${countdown}s` : '发送验证码'}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginBtnText}>{isLoading ? '登录中...' : '登 录'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerLink} onPress={() => Alert.alert('提示', '注册功能开发中')}>
            <Text style={styles.registerText}>还没有账号？立即注册</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 80 },
  logoArea: { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  logoText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  tabRow: { flexDirection: 'row', marginBottom: Spacing.lg },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: FontSize.md, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontWeight: '600' },
  form: { gap: Spacing.md },
  input: { height: 48, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, fontSize: FontSize.md, color: Colors.text, backgroundColor: '#fafafa' },
  codeRow: { flexDirection: 'row', gap: Spacing.sm },
  codeBtn: { width: 110, height: 48, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  codeBtnDisabled: { backgroundColor: '#ccc' },
  codeBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '600' },
  loginBtn: { height: 48, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginTop: Spacing.sm },
  loginBtnDisabled: { backgroundColor: '#ccc' },
  loginBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '600' },
  registerLink: { alignItems: 'center', marginTop: Spacing.md },
  registerText: { color: Colors.primary, fontSize: FontSize.sm },
});
