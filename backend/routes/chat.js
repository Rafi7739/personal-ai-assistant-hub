const express = require('express');
const router = express.Router();
const {
    createChat, sendMessage, getChats, getChat, updateChat,
    toggleBookmark, togglePin, deleteChat, exportChat, getDashboardStats
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats/dashboard', getDashboardStats);
router.route('/').get(getChats).post(createChat);
router.route('/:id').get(getChat).put(updateChat).delete(deleteChat);
router.post('/:id/messages', sendMessage);
router.put('/:id/bookmark', toggleBookmark);
router.put('/:id/pin', togglePin);
router.get('/:id/export', exportChat);

module.exports = router;