const express = require('express');
const router = express.Router();
const {
  upsertNotification,
  getNotificationByUserId,
  getAllNotifications,
  updateNotification
} = require('../controllers/notificationController');

router.post('/notifications', upsertNotification);

router.get('/notifications/:id', getNotificationByUserId);

router.get('/notifications', getAllNotifications);
router.put('/notificationsUpdate/:id', updateNotification);
module.exports = router;
