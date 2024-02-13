import { func } from "joi"
import {db} from "../database/database.connection.js"

export async function getCustomers(req,res) {
    try {
        const result= await db.query(`SELECT * FROM customers;`);

        const customers = result.rows.map(c => {
            return {
                ...c,
                birthday: dayjs(c.birthday).format('YYYY-MM-DD')
            }
        });

        res.send(customers);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomersById(req,res) {

    const {id} = req.params;

    try {
        const result = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        
        if (result.rowCount === 0)
            return res.status(404).send({message: 'Jogo não encontrado'});
        
        const game = {
            ...result.rows[0],
            birthday: dayjs(result.rows[0].birthday).format('YYYY-MM-DD')
        }
        res.send(game)

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createCustomer(req,res) {
    
    const {name, phone, cpf, birthday} = req.body;
    
    try {

        const customer = await db.query(`SELECT cpf FROM customers WHERE cpf = $1;`, [cpf])

        if (customer.rowCount > 0)
            return res.status(409).send({message:'CPF já cadastrado'})

        await db.query(`
            INSERT INTO customers(name, phone, cpf, birthday)
            VALUES( $1, $2, $3, $4)
        `, [name, phone, cpf, birthday]);  
        
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function updateCustomer(req, res){

    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;

    try{

        const customer = await db.query('SELECT id, cpf FROM customers WHERE cpf = $1;', [cpf]);

        if (customer.rowCount > 0 && id !== customer.rows[0].id)
            return res.status(409).send({message:'CPF já cadastrado para outro cliente'});

        await db.query(`
            UPDATE customers 
            SET name = $1, phone = $2, cpf = $3, birthday = $4
            WHERE id = $5;
        `, [name, phone, cpf, birthday, id]);

        res.sendStatus(200);

    } catch (err){
        res.status(500).send(err.message)
    }

}



