const IpDate = require('../Model/IpDate');

const saveIpDate = async (req, res) => {
  try {
    const { ip, date } = req.body;

    if (!ip || !date) {
      return res.status(400).json({ message: "IP and Date are required" });
    }

    const existingRecord = await IpDate.findOne({ where: { ip, date } });

    if (existingRecord) {
      return res.status(200).json({ message: "Record for today already exists", record: existingRecord });
    }

    const record = await IpDate.create({ ip, date });

    res.status(201).json({
      message: "✅ IP and Date saved successfully",
      record
    });

  } catch (error) {
    console.error("❌ Error saving IP & Date:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getIpDates = async (req, res) => {
  try {
    const records = await IpDate.findAll();
    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching IP & Date records:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { saveIpDate, getIpDates };
