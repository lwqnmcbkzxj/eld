const router = require('express').Router();
const { makeQuery, makeResponse } = require('../../utils.js');

const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });

router.use('/', urlencodedParser);

router.delete('/', (req, res) => {  /* dvir_id */
    if (!req.body) res.status(400).send(makeResponse(1, 'Empty req.body received'));
    const dvir_id = req.body.dvir_id;
    if (!dvir_id) res.status(400).send(makeResponse(1, 'Empty dvir_id received'));
    makeQuery(`update dvir set dvir_status = 'DELETED' where dvir_id = ?`, [dvir_id], (suc) => {
        res.status(200).send(makeResponse(0, 'Soft delete is done'));
    }, (fail) => {
        res.status(500).send(makeResponse(2, 'Unexpected error proceding soft delete'));
    });
});

module.exports = router;