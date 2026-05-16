const express = require('express');
const router = express.Router();
const { useTool, getToolHistory, getTools } = require('../controllers/toolController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getTools);
router.get('/history', getToolHistory);
router.post('/:toolName', useTool);

module.exports = router;