import {db} from "../db.js"

export const get = (req,res) => {
    const getAllGames = "SELECT DATE_FORMAT(created_at, '%m/%d/%Y %H:%i:%s') AS date,gameid,gameseqid,player1name,player2name,result FROM games;"
    db.query(getAllGames,(err,result) => {
        if(err) return res.json(err);
        return res.json(result)
    })
}

export const create = (req,res) => {
    const getMaxGameIdQuery = req.body.newInputs.session === "NEW" ? "SELECT IFNULL(MAX(gameid), 0) + 1 AS max_gameid FROM games;" : "SELECT MAX(gameid) AS max_gameid FROM games;"
    db.query(getMaxGameIdQuery,(err,result) =>{
        if(err) return res.json(err);
        const getGameSeqIdQuery = "SELECT IFNULL(MAX(gameseqid), 0) + 1 AS max_gameseqid FROM games WHERE gameid = ?"
        db.query(getGameSeqIdQuery, [result[0]["max_gameid"]], (err,data) =>{
            if(err) return res.json(err);
            const insertGameQuery = "INSERT INTO games(`gameid`,`gameseqid`,`player1name`,`player2name`,`result`,`created_at`,`deleted_at`,`updated_at`) VALUES (?)"
            const values = [
                result[0]["max_gameid"],
                data[0]['max_gameseqid'],
                req.body.newInputs.player1name,
                req.body.newInputs.player2name,
                null,
                new Date(),
                null,
                new Date()
            ]

            db.query(insertGameQuery,[values],(err,response) =>{
                if(err) return res.json(err);
                return res.status(200).json("Games has been recorded")
            })
        })
    })
}

export const update = (req,res) => {
    const getMaxGameIdQuery = "SELECT MAX(gameid) AS max_gameid FROM games;"
    db.query(getMaxGameIdQuery,(err,result) =>{
        if(err) return res.json(err);
        const getGameSeqIdQuery = "SELECT MAX(gameseqid) AS max_gameseqid FROM games WHERE gameid = ?"
        db.query(getGameSeqIdQuery, [result[0]["max_gameid"]], (err,data) =>{
            if(err) return res.json(err);
            const updateGameQuery = "UPDATE games SET result = ?, updated_at = ? WHERE gameid = ? AND gameseqid = ?"
            db.query(updateGameQuery,[req.body.result,new Date(),result[0]["max_gameid"],data[0]['max_gameseqid']], (err,response) => {
                if(err) return res.json(err);
                return res.json(response)
            })
        })
    })
}