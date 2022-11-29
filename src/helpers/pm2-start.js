// server escuchando en puerto 8080
const express = require("express");
const pm2 = require("pm2");

const app = express();

const isCluster = (process.argv[2] || "FORK").toUpperCase() === "CLUSTER";
const isFork = !isCluster;
const serverName = process.argv[3];
const port = process.argv[4] || 8080;
console.log(isCluster);
console.log(serverName);
console.log(port);
const startUpOption = {
    script: "main.js",
    name: serverName,
    args: [`${port}`],
    watch: true,
    execMode:  isCluster ? 'cluster' : 'fork',
    instances: isCluster ? 4 : 1
};

pm2.connect(function (err) {
    if (err) {
    console.error(err);
    process.exit(2);
    }

    pm2.start(startUpOption,
    function (err, apps) {
        if (err) {
        console.error(err);
        return pm2.disconnect();
        }

        pm2.list((err, list) => {
        console.log(err, list);

        pm2.restart(serverName, (err, proc) => {
          // Disconnects from PM2
            pm2.disconnect();
        });
        });
    }
    );
});

console.log(process.argv);
