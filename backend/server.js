import app from "./app.js";
import connectDB from "./Config/database.js";
import { createServer } from 'http';

connectDB();

let server;

server = createServer(app);

server.listen(process.env.PORT, ()=>{
    console.log(`Server is Working on ${process.env.PORT}`);
})