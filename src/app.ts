import express,{Express} from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

const initApp = async () => {
    return new Promise<Express>((resolve, reject) => {
        const db = mongoose.connection;
        db.on("error", (error) => {
            console.error("Database connection error:", error);
            
        }); 
        db.once("open", () => {
            console.log("Connected to database");
          
        });
        if(process.env.DB_CONNECT===undefined){
            console.error("DB_CONNECT is not defined in .env file");
            reject();
        }
        else{
            mongoose.connect(process.env.DB_CONNECT).then(() => {
                console.log("Connected to database");
                const bodyParser = require("body-parser");
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({ extended: true }));
            }).catch((error) => {
                console.error("Database connection error:", error);
                reject(error);
            });
        
        
        const postRoutes = require("./routes/post");
        app.use("/posts", postRoutes);
        
        const commentRoutes = require("./routes/comment");
        app.use("/comments", commentRoutes);
        
        
        
        
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
        
        }
        resolve
}
)}

export default initApp;
