const apiRouter = require('express').Router();

const enveloppesRouter = require('./enveloppes');
apiRouter.use('/enveloppes', enveloppesRouter);

const transactionsRouter = require('./transactions');
apiRouter.use('/transactions', transactionsRouter);

const docsRouter = require('./docs');
apiRouter.use('/docs', docsRouter);



module.exports = apiRouter;
