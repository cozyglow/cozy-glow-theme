module.exports = context => {
  return {
    map: context.file.dirname.includes('examples') ?
      false :
      {
        inline: false,
        annotation: true,
        sourcesContent: true
      },
    plugins: {
      autoprefixer: {
        cascade: false
      },
      rtlcss: context.env === 'RTL' ? {} : false
    }
  };
};
