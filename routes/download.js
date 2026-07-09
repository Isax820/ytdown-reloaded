const router = require("express").Router();
const controller = require("../controllers/downloadController");

router.get("/", controller.index);

router.post("/", controller.download);

module.exports = router;