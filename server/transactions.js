const transactionsRouter = require('express').Router();
const pool = require('../db/db');

module.exports = transactionsRouter;


const { Pool } = require('pg');

/**
 * @swagger
 * /api/transactions:
 *    get:
 *      summary: Get all transactions
 *      produces:
 *        - application/json
 *      tags:
 *        - Transactions
 *      responses:
 *        "200":
 *          description: Returns a list of all transactions
 *
 */
 transactionsRouter.get('/', async (req, res) => {
    try {
        const allTransactions = await pool.query('SELECT * FROM transactions');
        if (allTransactions.rowCount < 1) {
            return res.status(404).send({
                message: "There are no transactions"
            });
        };
        res.status(200).send({
            status: 'Success',
            message: 'Transaction information retrieved!',
            data: allTransactions.rows,
        });
    } catch (err) {
        console.error(err.message);
    };
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     produces:
 *      - application/json
 *     tags:
 *      - Transactions
 *     parameters:
 *      - in : path
 *        name: id
 *        description: transaction id
 *        type: integer
 *        required: true
 *        example: 1
 *     responses:
 *      "200":
 *        description: Returns a transaction with its details
 *      "404":
 *        description: Transaction not found
 *      "500":
 *        description: Internal server error
 */
 transactionsRouter.get('/:transactionId', async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await pool.query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
        if (transaction.rowCount < 1) {
            return res.status(404).send({
                message: "There is no transaction with this id"
            });
        };
        res.status(200).send({
            status: 'Sucess',
            message: 'Transaction information retrieved!',
            data: transaction.rows[0]
        });
    } catch (error) {
        console.error(error.message);
    };
});  

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Creates a new transaction and update an enveloppe's budget
 *     produces:
 *       - application/json
 *     tags:
 *       - Transactions
 *     requestBody:
 *       description: Data for the new transaction
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *              payment_amount:
 *                type: integer
 *              enveloppe_id:
 *                type: integer
 *            example:
 *              description: tips
 *              payment_amount: 10
 *              enveloppe_id: 1
 *     responses:
 *       "201":
 *         description: Returns created transaction
 *       "500":
 *         description: Internal server error
 */
 transactionsRouter.post('/', async (req, res) => {
    try {
        const { description, payment_amount, enveloppe_id } = req.body;
        const date = new Date();
        await pool.query('BEGIN');
        const enveloppe = await pool.query('SELECT * FROM enveloppes WHERE id = $1', [enveloppe_id]);
        if (enveloppe.rowCount < 1) {
            return res.status(404).send({
                message: "There is no enveloppe with this id."
            });
        };
        const newTransaction = await pool.query('INSERT INTO transactions (date, description, payment_amount, enveloppe_id) VALUES ($1, $2, $3, $4) RETURNING *', 
        [date, description, payment_amount, enveloppe_id]);
        const updatingEnveloppe = await pool.query('UPDATE enveloppes SET budget = budget - $1 where id = $2 RETURNING *',
        [payment_amount, enveloppe_id]);
        await pool.query('COMMIT');
        res.status(201).send({
            status: 'Sucess',
            message: 'New transaction created!',
            data: newTransaction.rows[0]
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error.message);
    };
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Updates an existing transaction and change enveloppe's budget
 *     produces:
 *        - application/json
 *     tags: 
 *        - Transactions
 *     parameters:
 *        - in: path
 *          name: id
 *          description: transaction ID to update
 *          type: integer
 *          required: true
 *          example: 1
 *     requestBody:
 *       description: New data for the existing transaction
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                payment_amount:
 *                  type: integer
 *              example:
 *                description: Gift
 *                payment_amount: 150
 *     responses:
 *       "201":
 *         description: Returns updated transaction
 *       "404":
 *         description: Transaction not found
 *       "500": 
 *         description: Internal server error
 */
 transactionsRouter.put('/:transactionId', async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { description, payment_amount } = req.body;
        await pool.query('BEGIN');
        const transaction = await pool.query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
        if (transaction.rowCount < 1) {
            return res.status(404).send({
                message: 'There is no transaction with this id.'
            });
        };
        const prevAmount = await pool.query('SELECT payment_amount FROM transactions WHERE id = $1', [transactionId]);
        await pool.query('UPDATE enveloppes SET budget = (budget + $1) - $2 WHERE id in (SELECT enveloppe_id FROM transactions WHERE id = $3', 
        [prevAmount.rows[0], payment_amount, transactionId]);

        const updatedTransaction = await pool.query('UPDATE transactions SET description = $1, payment_amount = $2 WHERE id = $3', 
        [description, payment_amount, transactionId]);
        await pool.query('COMMIT');
        res.status(200).send({
            status: 'Sucess',
            message: 'The transaction has been updated!',
            data: updatedTransaction.rows[0]
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error.message);
    };
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Deletes an specific transaction
 *     produces: 
 *       - application/json
 *     tags: 
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Transaction ID to delete
 *         type: integer
 *         required: true
 *         example: 1
 *     responses:
 *       "204":
 *         description: Transaction deleted
 *       "404":
 *         description: Transaction not found
 *       "500":
 *         description: Internal server error
 */
 transactionsRouter.delete('/:transactionId', async (req, res) => {
    try {
        const { transactionId } = req.params;
        const deletedTransaction = await pool.query('DELETE FROM transactions WHERE id = $1', [transactionId]);
        res.json(`Transaction number ${transactionId} has been successfully deleted! `); 
    } catch (error) {
        console.error(error.message);
    };
});   