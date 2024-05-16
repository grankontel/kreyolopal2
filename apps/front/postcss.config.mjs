/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {
      preset: 'advanced',
      discardComments: { removeAll: true },
    },
  },
};

export default config;
