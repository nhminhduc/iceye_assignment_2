module.exports = {
  apps: [
    {
      name: "larvis-frontend",
      script: "npx",
      args: "serve -s dist -l 3000 --no-clipboard",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
    },
  ],
};
