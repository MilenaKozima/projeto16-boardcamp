import { db } from "../database/database.connection";

export async function getRentals(req, res) {
    try {

        const result = await db.query(`
            SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName" FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id;
        `);

        const rentals = result.rows.map(rental => {
            const obj = {
                ...rental,
                rentDate: dayjs(rental.rentDate).format('YYYY-MM-DD'),
                customer: {
                    id: rental.customerId,
                    name: rental.customerName
                },
                game: {
                    id: rental.gameId,
                    name: rental.gameName
                }
            }

            delete obj.customerName;
            delete obj.gameName;

            return obj;

        });

        res.send(rentals);

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {

        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);

        if (customer.rowCount === 0)
            return res.status(400).send({ message: "Cliente não cadastrado!" });

        const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);

        if (game.rowCount === 0)
            return res.status(400).send({ message: "Jogo não cadastrado!" });


        const resultRentals = await db.query(
            `SELECT rentals.*, games."pricePerDay"
                FROM rentals 
                JOIN games ON rentals."gameId" = games.id
                WHERE "gameId" = $1 AND "returnDate" IS NULL;
            `, [gameId]);

        const rentalsTot = resultRentals.rowCount;

        console.log(game.rows[0].stockTotal, rentalsTot);


        if (game.rows[0].stockTotal - rentalsTot <= 0)
            return res.status(400).send({ message: 'Jogo indisponivel' });

        const originalPrice = daysRented * game.rows[0].pricePerDay;

        await db.query(`
            INSERT INTO rentals( "customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee" )
             VALUES($1, $2, $3, $4, $5, NULL, NULL)
        `, [customerId, gameId, daysRented, dayjs().format("YYYY-MM-DD"), originalPrice]);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function finishRental(req, res) {
    const { id } = req.params;

    try {

        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);

        if ( rental.rowCount === 0)
            return res.status(404).send({message:'Registro de alguel de jogo não encontrado'});

        if ( rental.rows[0].returnDate !== null)
            return res.status(400).send({message:'Jogo já foi devolvido'});

        await db.query(`
            UPDATE rentals SET returnDate = NOW() WHERE id = $1;
        `, [id]);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

