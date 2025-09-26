const axios = require("axios");

const fetchCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.category_id || 125;
    const apiKey = process.env.FRED_API_KEY;
    const baseUrl = process.env.FRED_BASE_URL;

    if (!apiKey) {
      throw new Error("Missing FRED_API_KEY in .env");
    }

    const response =   await axios.get(`${baseUrl}/category`, {
      params: {
        category_id: categoryId,
        api_key: apiKey,
        file_type: "json",
      },
    });

    res.json({ success: true, data: response.data });
  } catch (err) {
    next(err);
  }
};


const fetchAllCategories = async (req, res, next) => {
  try {
    const parentId = req.query.category_id || 0; 
    const apiKey = process.env.FRED_API_KEY;
    const baseUrl = process.env.FRED_BASE_URL; 

    if (!apiKey) {
      throw new Error("Missing FRED_API_KEY in .env");
    }

    const url = `${baseUrl}/category/children`;
    const response = await axios.get(url, {
      params: {
        category_id: parentId,
        api_key: apiKey,
        file_type: "json",
      },
    });

    res.json({ success: true, data: response.data });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  fetchCategory, 
  fetchAllCategories
};
