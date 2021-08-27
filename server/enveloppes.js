const enveloppesRouter = require('express').Router();
const pool = require('../db/db');

module.exports = enveloppesRouter;

const { Pool } = require('pg');

/**
 * @swagger
 * /api/enveloppes:
 *    get:
 *      summary: Get all enveloppes
 *      produces:
 *        - application/json
 *      tags:
 *        - Enveloppes
 *      responses:
 *        "200":
 *          description: Returns a list of all envelopes
 *
 */
 enveloppesRouter.get('/', async (req, res) => {
    try {
        const allEnveloppes = await pool.query('SELECT * FROM enveloppes ORDER BY id');
        if (allEnveloppes.rowCount < 1) {
            return res.status(404).send({
                message: "There are no enveloppes"
            });
        };
        res.status(200).send({
            status: 'Success',
            message: 'Enveloppes information retrieved!',
            data: allEnveloppes.rows,
        });
    } catch (err) {
        console.error(err.message);
    };
});

/**
 * @swagger
 * /api/enveloppes/{id}:
 *   get:
 *     summary: Get an enveloppe by ID
 *     produces:
 *      - application/json
 *     tags:
 *      - Enveloppes
 *     parameters:
 *      - in : path
 *        name: id
 *        description: enveloppe id
 *        type: integer
 *        required: true
 *        example: 1
 *     responses:
 *      "200":
 *        description: Returns an enveloppe with its details
 *      "404":
 *        description: Enveloppe not found
 *      "500":
 *        description: Internal server error
 */
 enveloppesRouter.get('/:enveloppeId', async (req, res) => {
    try {
        const { enveloppeId } = req.params;
        const anEnveloppe = await pool.query('SELECT * FROM enveloppes WHERE id = $1', [enveloppeId]);
        if (anEnveloppe.rowCount < 1) {
            return res.status(404).send({
                message: "There is no enveloppe with this id"
            });
        };
        res.status(200).send({
            status: 'Sucess',
            message: 'Enveloppe information retrieved!',
            data: anEnveloppe.rows[0]
        });
    } catch (error) {
        console.error(error.message);
    };
});

/**
 * @swagger
 * /api/enveloppes:
 *   post:
 *     summary: Creates a new enveloppe
 *     produces:
 *       - application/json
 *     tags:
 *       - Enveloppes
 *     requestBody:
 *       description: Data for the new enveloppe
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              budget:
 *                type: integer
 *            example:
 *              title: Restaurant
 *              budget: 90
 *     responses:
 *       "201":
 *         description: Returns created enveloppe
 *       "500":
 *         description: Internal server error
 */
 enveloppesRouter.post('/', async (req, res) => {
    try {
        const { title, budget } = req.body;
        const newEnveloppe = await pool.query('INSERT INTO enveloppes (title, budget) VALUES ($1, $2) RETURNING *', 
        [title, budget]);
        res.status(201).send({
            status: 'Sucess',
            message: 'New enveloppe created!',
            data: newEnveloppe.rows[0]
        });
    } catch (error) {
        console.error(error.message);
    };
});

/**
 * @swagger
 * /api/enveloppes/{id}:
 *   put:
 *     summary: Updates an existing enveloppe
 *     produces:
 *        - application/json
 *     tags: 
 *        - Enveloppes
 *     parameters:
 *        - in: path
 *          name: id
 *          description: enveloppe ID to update
 *          type: integer
 *          required: true
 *          example: 1
 *     requestBody:
 *       description: New data for the existing enveloppe
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                budget:
 *                  type: integer
 *              example:
 *                title: Surf lesson
 *                budget: 150
 *     responses:
 *       "201":
 *         description: Returns updated enveloppe
 *       "404":
 *         description: Enveloppe not found
 *       "500": 
 *         description: Internal server error
 */
 enveloppesRouter.put('/:enveloppeId', async (req, res) => {
    try {
        const { enveloppeId } = req.params;
        const { title, budget } = req.body;
        const updatedEnveloppe = await pool.query('UPDATE enveloppes SET title = $1, budget = $2 WHERE id = $3', 
        [title, budget, enveloppeId]);
        res.status(200).send({
            status: 'Sucess',
            message: 'The enveloppe has been updated!',
            data: updatedEnveloppe.rows[0]
        });
    } catch (error) {
        console.error(error.message);
    };
}); 

/**
 * @swagger
 * /api/enveloppes/{id}:
 *   delete:
 *     summary: Deletes an specific enveloppe
 *     produces: 
 *       - application/json
 *     tags: 
 *       - Enveloppes
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Enveloppe ID to delete
 *         type: integer
 *         required: true
 *         example: 1
 *     responses:
 *       "204":
 *         description: Enveloppe deleted
 *       "404":
 *         description: Enveloppe not found
 *       "500":
 *         description: Internal server error
 */
 enveloppesRouter.delete('/:enveloppeId', async (req, res) => {
    try {
        const { enveloppeId } = req.params;
        const findEnv = await pool.query('SELECT * FROM enveloppes WHERE id = $1', [enveloppeId]);
        if (findEnv.rowCount < 1) {
            return res.status(404).send({
                message: "There is no enveloppe with this id"
            });
        };
        const deletedEnveloppe = await pool.query('DELETE FROM enveloppes WHERE id = $1', [enveloppeId]);
        res.sendStatus(204); 
    } catch (error) {
        console.error(error.message);
    };
});

/**
 * @swagger
 * /api/enveloppes/transfer/{from}/{to}:
 *   post:
 *     summary: Transfer an amount from a specific enveloppe to another one
 *     produces:
 *        - application/json
 *     tags: 
 *        - Enveloppes
 *     parameters:
 *        - in: path
 *          name: from
 *          description: enveloppe id (from)
 *          type: integer
 *          required: true
 *          example: 1
 *        - in: path
 *          name: to
 *          description: enveloppe id (to)
 *          type: integer
 *          required: true
 *          example: 2
 *     requestBody:
 *         description: Amount to transfer
 *         required: true
 *         content:
 *            application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  amount:
 *                    type: integer
 *                example:
 *                  amount: 10
 *     responses:
 *        "201":
 *          description: Returns updated enveloppes
 *        "404":
 *          description: Enveloppes not found
 *        "500":
 *          desription: Internal server error
 */
enveloppesRouter.post('/enveloppes/transfer/:from/:to', async (req, res) => {
    try {
        const { from, to } = req.params;
        const { amount } = req.body;
        const transferFrom = await pool.query('UPDATE enveloppes SET budget = budget - $1 WHERE id = $2', [amount, from]);
        const transferTo = await pool.query('UPDATE enveloppes SET budget = budget + $1 WHERE id = $2', [amount, to]);
        res.json(`The budget of the enveloppes number ${from} and ${to} have been successfully updated`);
    } catch (error) {
        console.error(error.message);
    };
});   