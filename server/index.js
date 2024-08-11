import express from "express";
import cors from "cors";
import gameRoutes from "./routes/games.js"

const app = express();

app.use(cors())
app.use(express.json())
app.use("/api/games", gameRoutes)


app.listen(8080,() =>{
    console.log("Connected")
})