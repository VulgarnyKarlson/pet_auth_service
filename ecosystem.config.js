module.exports = {
    apps: [
        {
            name: "healthcheck",
            script: "healthcheck/server.js",
            exec_mode: "cluster",
            instances: 1,
            autorestart: true,
            watch: false,
            interpreter: 'node',
            max_memory_restart: "500M",
            listen_timeout: 20000,
            env: {
                PM2_INSTANCES: process.env.PM2_INSTANCES || 48,
            },
            output: 'NULL',
            error: 'NULL',
        },
        {
            name: "auth",
            script: "dist/main.js",
            exec_mode: "cluster",
            instances: process.env.PM2_INSTANCES || 0,
            autorestart: true,
            watch: false,
            interpreter: 'node',
            interpreter_args: [
                "-r", "ts-node/register",
                "-r", "tsconfig-paths/register",
            ],
            max_memory_restart: "500M",
            wait_ready: true,
            listen_timeout: 20000,
            env: {
                NODE_ENV: "production",
                NODE_PATH: "dist",
                TS_NODE_PROJECT: "tsconfig.run.json",
            },
            output: 'NULL',
            error: 'NULL',
        },
    ],
}
