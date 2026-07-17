import {Server} from "socket.io";
import app from "../app.js";
let io;
export function initSocket(httpServer){
  io = new Server(httpServer , {
    cors:{
      origin:"http://localhost:5173",
      credentials:true,
      methods:["GET","POST","PUT","DELETE"]
    }
  })

  console.log("Socket io server is running");

  io.on("connection" ,(socket)=>{
    console.log("A user conneected : "+socket.id);

    socket.on("join_room" ,(data)=>{
      
    })
  })
}

export function getIo(){
  if(!io){
    throw new Error ("Socket io is not initilize")
  }

  return io;


}
