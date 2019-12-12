const routers = require('../routers/routers');

module.exports = (app) => {
    app.use('/', routers.home);

    app.use('/user', routers.user);

    app.use('/expense', routers.expenses);

    app.use('*', (req, res, next) => {
        res.status(500).send({error: "No resource on req"})
    })
};