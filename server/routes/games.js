import express from "express";
import { get,create,update } from "../controllers/game.js"

const router = express.Router()

router.post("/get",get)
router.post("/create",create)
router.post("/update",update)

export default router