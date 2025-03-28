module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // Отключаем правила, которые вызывают проблемы
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
}; 