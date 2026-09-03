module.exports = {
  apps: [
    {
      name: 'facim-web',
      script: 'server.js',
      instances: 'max', // Utiliza todos os núcleos de CPU disponíveis (ou especifique um número como 2)
      exec_mode: 'cluster', // Execução em cluster para alta disponibilidade
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
