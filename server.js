require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');

const registerRoute = require('./routes/registerRoute');
const currencyRoutes = require('./routes/currencyRoutes');

const app = express();
app.use(express.json());


app.use('/api', registerRoute);
app.use('/api', currencyRoutes);

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ alter: true });  
    console.log('Tables synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Server failed:', err);
  }
})();
