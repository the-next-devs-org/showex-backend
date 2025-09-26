require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');

const registerRoute = require('./routes/registerRoute');
const currencyRoutes = require('./routes/currencyRoutes');
const fredRoutes = require('./routes/fredCategoriesRoutes');
const fredReleaseRoutes = require('./routes/fredReleasesRoutes');
const fredSeriesRoutes = require('./routes/fredSeriesRoutes')
const fredSourcesRoutes = require('./routes/fredSourcesRoutes')
const fredTagsRoutes = require('./routes/fredTagsRoutes')


const app = express();
app.use(express.json());

app.use('/api' , fredTagsRoutes)
app.use('/api', fredSourcesRoutes)
app.use('/api', fredSeriesRoutes)
app.use('/api', fredReleaseRoutes)
app.use(`/api`, fredRoutes);
app.use('/api', registerRoute);
app.use('/api', currencyRoutes);

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync();
    console.log('Tables synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Server failed:', err);
  }
})();
