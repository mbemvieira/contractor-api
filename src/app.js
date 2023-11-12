const express = require('express');
const bodyParser = require('body-parser');
const routerAdmin = require('./routes/admin');
const routerContracts = require('./routes/contracts');
const routerJobs = require('./routes/jobs');
const routerBalances = require('./routes/balances');
const { initModels } = require('./database/model');

// App setup
const app = express();

app.use(bodyParser.json());

// Metadata setup
const sequelize = initModels();

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

// Define routes
app.use('/admin', routerAdmin);
app.use('/contracts', routerContracts);
app.use('/jobs', routerJobs);
app.use('/balances', routerBalances);

module.exports = app;
