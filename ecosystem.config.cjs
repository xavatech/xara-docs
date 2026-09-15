module.exports = {
  apps: [
    {
      name: "XaraDocs:7237",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
      env: {
        PORT: 7237,
        HOST: "127.0.0.1",
        // Shared secret for the custom-domain provisioning endpoint.
        // Must match DOMAIN_PROVISION_SECRET on the backend. Falls back to the
        // literal so `pm2 reload` works even in a non-login deploy shell.
      },
    },
  ],
};
