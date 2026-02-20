import dotenv from "dotenv"


import connnect_db from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})




connnect_db()
.then(()=>

    app.listen((process.env.PORT || 8000), () =>{
        console.log(`Serrver is running at port ${process.env.PORT}`);
        
    })
)
.catch((error)=> {
    console.log(`Mongdb connection failed to connect ${error}`);
})