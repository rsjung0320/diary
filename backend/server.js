 // require는 node.js에서 import를 뜻한다. 그래서 http관련을 가져온다.
 const app = require("./app");
 const debug = require("debug")("node-angular");
 const http = require("http");

 const normalizePort = val => {
   var port = parseInt(val, 10);

   if (isNaN(port)) {
     // named pipe
     return val;
   }

   if (port >= 0) {
     // port number
     return port;
   }

   return false;
 };

 const onError = error => {
   if (error.syscall !== "listen") {
     throw error;
   }
   const bind = typeof port === "string" ? "pipe " + port : "port " + port;
   switch (error.code) {
     case "EACCES": // Permission denied
       console.error(bind + " requires elevated privileges");
       process.exit(1);
       break;
     case "EADDRINUSE": // Address already in use
       console.error(bind + " is already in use");
       process.exit(1);
       break;
     default:
       throw error;
   }
 };

 const onListening = () => {
   const addr = server.address();
   const bind = typeof port === "string" ? "pipe " + port : "port " + port;
   debug("Listening on " + bind);
 };

 const port = normalizePort(process.env.PORT || "3000");
 app.set("port", port);

 const server = http.createServer(app);
 server.on("error", onError);
 server.on("listening", onListening);
 server.listen(port);
