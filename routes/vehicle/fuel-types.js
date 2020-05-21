const express = require('express');
const router = express.Router();
const { makeResponse } = require('../../utils.js');

router.get('/', async function(req, res) {
    const fuel_types = ['DIESEL', 'GASOLINE', 'PROPANE', 'LIQUID NATURAL GAS', 'COMPRESSED NATURAL GAS', 'ETHANOL'];
    return res.status(200).send(makeResponse(0, fuel_types))
});

module.exports = router;