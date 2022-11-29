const express = require("express")
const app = express();
const {Router} = require("express")

const { cwd, execArgv, argv } = require("process");
const logger = require("../logs/log4js");
const compression = require("compression");
const numCPUs = require("os").cpus().length;
const routerInfo = new Router()

app.set("view engine", "ejs");
app.set("views", "./views");

////////////////////////////// INFO //////////////////////

routerInfo.get("/", (req, res) => {
    try {
        const information = {
        cwd: process.cwd(),
        pid: process.pid,
        ppid: process.ppid,
        version: process.version,
        title: process.title,
        platform: process.platform,
        memoryUsage: process.memoryUsage().rss,
        execPath: process.execPath,
        execArgv: process.execArgv,
        numCPUs: numCPUs,
        cpuUsage: JSON.stringify(process.cpuUsage()),
        };
        res.render("pages/info.ejs", {
            cwd: information.cwd,
            pid: information.pid,
            ppid: information.ppid,
            version: information.version,
            title: information.title,
            platform: information.platform,
            memoryUsage: information.memoryUsage,
            execPath: information.execPath,
            execArgv: information.execArgv,
            numCPUs: information.numCPUs,
            cpuUsage: information.cpuUsage,
        });
    } catch (err) {
        logger.error(err);
    }
});

routerInfo.get("/gzip", compression(), (req, res) => {
    try {
        const information = {
            cwd: process.cwd(),
            pid: process.pid,
            ppid: process.ppid,
            version: process.version,
            title: process.title,
            platform: process.platform,
            memoryUsage: process.memoryUsage().rss,
            execPath: process.execPath,
            execArgv: process.execArgv,
            numCPUs: numCPUs,
            cpuUsage: JSON.stringify(process.cpuUsage()),
        };
        res.render("pages/infogzip.ejs", {
            cwd: information.cwd,
            pid: information.pid,
            ppid: information.ppid,
            version: information.version,
            title: information.title,
            platform: information.platform,
            memoryUsage: information.memoryUsage,
            execPath: information.execPath,
            execArgv: information.execArgv,
            numCPUs: information.numCPUs,
            cpuUsage: information.cpuUsage,
        });
    } catch (err) {
        logger.error(err);
    }
});

module.exports = routerInfo

////////////////////////////////////////////////////////////////