const Notification = require('../Model/Notification'); 


// ✅ Create or Update Notification
const upsertNotification = async (req, res) => {
  try {
    const { user_id, notification, currencies } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "❌ user_id is required" });
    }

    // Check if notification record already exists for this user
    const existing = await Notification.findOne({ where: { user_id } });

    if (existing) {
      // Update record
      existing.notification = notification || existing.notification;
      existing.currencies = currencies || existing.currencies;
      await existing.save();

      return res.json({
        message: "✅ Notification preferences updated successfully",
        data: existing
      });
    } else {
      // Create new record
      const newNotification = await Notification.create({
        user_id,
        notification,
        currencies
      });

      return res.status(201).json({
        message: "✅ Notification preferences created successfully",
        data: newNotification
      });
    }

  } catch (error) {
    console.error("❌ Error in upsertNotification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Get Notification by User ID
const getNotificationByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({ where: { user_id: id } });

    if (!notification) {
      return res.status(404).json({ message: "⚠️ Notification not found" });
    }

    res.json({
      message: "✅ Notification fetched successfully",
      data: notification
    });

  } catch (error) {
    console.error("❌ Error fetching notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Get All Notifications (Optional — Admin Feature)
const getAllNotifications = async (req, res) => {
  try {
    const list = await Notification.findAll();
    res.json({
      message: "✅ All notifications fetched successfully",
      data: list
    });
  } catch (error) {
    console.error("❌ Error fetching all notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { notifications, defaultCurrencies } = req.body;

    const existing = await Notification.findOne({ where: { user_id: id } });

    if (!existing) {
      // agar pehla record nahi hai to create karo
      const newNotification = await Notification.create({
        user_id: id,
        notification: JSON.stringify(notifications),
        currencies: JSON.stringify(defaultCurrencies),
      });

      return res.status(201).json({
        message: "✅ Notification created successfully",
        data: newNotification
      });
    }

    // agar record hai to update karo
    existing.notification = JSON.stringify(notifications);
    existing.currencies = JSON.stringify(defaultCurrencies);

    await existing.save();

    res.json({
      message: "✅ Notification updated successfully",
      data: existing
    });

  } catch (error) {
    console.error("❌ Error updating notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  upsertNotification,
  getNotificationByUserId,
  getAllNotifications,
  updateNotification
};
