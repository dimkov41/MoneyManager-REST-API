require('./config/database.config')().then(() => {
    const config = require('./config/app.config');
    const app = require('express')();

    require('./config/express.config')(app);
    require('./config/routes.config')(app);

    app.listen(3000, console.log(`***Server is ready! Listening on port: ${config.port}...***`));
});