const express = require("express");
const router = express.Router();

const {
    getAllSpaces,
    bookSeat
} = require("../controllers/spaceController");

router.get("/", getAllSpaces);
router.post("/book/:id", bookSeat);

module.exports = router;
