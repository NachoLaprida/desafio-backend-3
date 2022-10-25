
CON NODE O NODEMON
nodemon pm2-start "cluster" "Server1" "8081"
nodemon pm2-start "fork" "Server2" "8082"

CON FOREVER

forever pm2-start.js "cluster" "Server1" "8081"
forever pm2-start.js "fork" "Server2" "8082"


