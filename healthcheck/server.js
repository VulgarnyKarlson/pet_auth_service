let counter = 0;
const express = require('express')
const server = express();
const healthCountSuccess = Math.ceil(Number(process.env.PM2_INSTANCES)*0.75);

server.get('/status',(request, reply) => {
    console.log(counter, healthCountSuccess, counter >= healthCountSuccess ? 200:500);
    reply.status(counter >= healthCountSuccess ? 200:500);
    reply.send("");
});

server.get('/ready', (request, reply) => {
    counter++;
    console.log("HEALTHCHECK: READY " + counter);
    reply.send("").status(200);
});

server.get("/notready", (request, reply) => {
    counter--;
    console.log("HEALTHCHECK: READY " + counter);
    reply.send("").status(200);
});

server.listen(80, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`HEALTHCHECK SERVER LISTENING ON 0.0.0.0:80`);
});
