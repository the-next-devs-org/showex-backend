const express = require('express');
const app = express();

const currencyRoutes = require('./routes/currencyRoutes.js');
app.use(express.json());

app.use('/api', currencyRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
