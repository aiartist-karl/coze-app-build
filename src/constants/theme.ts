/**
 * 扣子 App 设计规范（从真实 CSS 提取）
 */
export const Colors = {
  // 主色系
  primary: '#0054e9',
  primaryRgb: '0, 84, 233',
  primaryShade: '#004acd',
  primaryTint: '#1a65eb',
  // 辅色
  secondary: '#0163aa',
  tertiary: '#6030ff',
  // 功能色
  success: '#2dd55b',
  warning: '#ffc409',
  danger: '#c5000f',
  // 中性色
  light: '#f4f5f8',
  medium: '#636469',
  dark: '#222428',
  // 背景
  background: '#ffffff',
  backgroundDark: '#1a1a1a',
  surface: '#f8f9fa',
  surfaceDark: '#242424',
  // 文字
  text: '#1a1a1a',
  textSecondary: '#636469',
  textLight: '#999999',
  textInverse: '#ffffff',
  // 边框
  border: '#e8e8e8',
  borderDark: '#333333',
  // 聊天气泡
  bubbleUser: '#0054e9',
  bubbleAssistant: '#f4f5f8',
  bubbleAssistantDark: '#2a2a2a',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
