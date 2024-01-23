const eventController = require('../controllers/eventController');
const express=require('express');
const router=express.Router();
const cors = require("cors");
router.use(cors());

router.get('/medal_data', eventController.getAllMedals);
router.post('/medal_input', eventController.postMedals);

module.exports=router;