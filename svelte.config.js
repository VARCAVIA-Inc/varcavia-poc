import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter(),
    // ...altre impostazioni se presenti
  }
  // ...altro
};

export default config;
