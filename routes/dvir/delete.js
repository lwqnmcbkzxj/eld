const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils.js');

const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });

router.use('/', urlencodedParser);

router.delete('/', async (req, res) => {  /* dvir_id */
    const req_user_id = req.auth_info.req_user_id;
    if (!req.body) res.status(400).send(makeResponse(1, 'Empty req.body received'));
    const dvir_id = req.body.dvir_id;
    if (!dvir_id) res.status(400).send(makeResponse(3, 'Empty dvir_id received'));

    let db;
    try {
        db = await mQuery(`select * from dvir where dvir_id = ? and creator_user_id = ?`, [ dvir_id, req_user_id ]);
    } catch(err) {
        return res.status(500).send(makeResponse(5, err));
    }
    if (db.length <= 0) return res.status(404).send(makeResponse(6, 'Could not find DVIR for user'));
    if (!db[0].dvir_status.localeCompare('DELETED')) return res.status(200).send(makeResponse(7, 'DVIR already deleted. No checks for signature'));
    const driver_signature_id = db[0].driver_signature_id;
    const mechanic_signature_id = db[0].mechanic_signature_id;

    // delete DVIR
    try {
        db = await mQuery(`update dvir set dvir_status = 'DELETED' where dvir_id = ? and creator_user_id = ?`, [ dvir_id, req_user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }
    const dvirs_deleted = (db) ? db.changedRows : 0;
    db = null;

    //delete driver_signature_id
    if (driver_signature_id) {
        try {
            const params = [ driver_signature_id, req_user_id ];
            db = await mQuery(`update signature set signature_status = 'DELETED' where signature_id = ? and signature_user_id = ?`, params);
        } catch (err) {
            return res.status(500).send(makeResponse(4, err));
        }
    }
    const driver_signatures_deleted = (db) ? db.changedRows : 0;
    db = null;

    //delete mechanic_signature_id
    if (mechanic_signature_id) {
        try {
            const params = [ mechanic_signature_id, req_user_id ];
            db = await mQuery(`update signature set signature_status = 'DELETED' where signature_id = ? and signature_user_id = ?`, params);
        } catch (err) {
            return res.status(500).send(makeResponse(5, err));
        }
    }
    const mechanic_signatures_deleted = (db) ? db.changedRows : 0;

    return res.status(200).send(makeResponse(0, {
        dvirs_deleted: dvirs_deleted,
        driver_signatures_deleted: driver_signatures_deleted,
        mechanic_signatures_deleted: mechanic_signatures_deleted
    }));
});

module.exports = router;