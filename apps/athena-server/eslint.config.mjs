import baseConfig from '../../eslint.config.mjs';

export default [...baseConfig,

{
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn'
  },
},
];
