const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models/model');
const routerAdmin = require('./routes/admin');
const routerContracts = require('./routes/contracts');
const routerJobs = require('./routes/jobs');

// App setup
const app = express();

app.use(bodyParser.json());

// Metadata setup
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

// Define routes
app.use('/admin', routerAdmin);
app.use('/contracts', routerContracts);
app.use('/jobs', routerJobs);

module.exports = app;
