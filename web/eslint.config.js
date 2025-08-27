import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';


export default [
  ...angular.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    rules: {
      '@angular-eslint/component-class-suffix': ['error', { suffixes: ['Component', 'Page'] }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
];
