import { db } from "../database/database.connection";

export async function getGames(req,res) {
    try {

        const games = await db.query(`SELECT * FROM games:`);
        res.send(games);
        
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createGames(req,res) {
    try {

    } catch (err) {
        res.status(500).send(err.message)
    }
}