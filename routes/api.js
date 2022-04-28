// Sets up the express router
const router = require("express").Router();
// sets up the transaction class
const transaction = require("../models/transaction_model.js");
// sets up the /api/transaction endpoint so it can be POSTed to
router.post("/api/transaction", ({body}, res) => {
  transaction.create(body)
    .then(dbtransaction => {
      res.json(dbtransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});
// allows you to bulk insert many transaction to the database
router.post("/api/transaction/bulk", ({body}, res) => {
  transaction.insertMany(body)
    .then(dbtransaction => {
      res.json(dbtransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});
// sets up the GET /api/transcation endpoint
router.get("/api/transaction", (req, res) => {
  transaction.find({}).sort({date: -1})
    .then(dbtransaction => {
      res.json(dbtransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});
// exports the router module
module.exports = router;