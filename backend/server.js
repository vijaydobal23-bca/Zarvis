import "dotenv/config.js";
import app from "./src/app.js";
import connectDb from "./src/config/db.js";

import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

connectDb();

const httpServer = http.createServer(app);
initSocket(httpServer);

 
httpServer.listen(process.env.PORT,()=>{
  console.log("server started at port 3000 ",process.env.PORT)
})      