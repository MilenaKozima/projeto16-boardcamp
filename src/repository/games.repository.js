import { db } from "../database/database.connection.js";

export function getAllGames(){
    const result = db.query(`SELECT * FROM games;`);
    return result;
}

export function getGameName(name){

    const result = db.query(`SELECT name FROM games WHERE name = $1;`, [name]);
    
    return result;
}

export function addGame(body){

    const { name, image, stockTotal, pricePerDay } = body;

    const result = db.query(`
        INSERT INTO games(name, image, "stockTotal", "pricePerDay")
            VALUES($1, $2, $3, $4);
        `, [name, image, stockTotal, pricePerDay]);
    
    return result;

}