const express = require('express');
const userRoute = require('./user.route');

const bookRoute = require('./book.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/user',
        route: userRoute,
    },
    {
        path: '/book',
        route: bookRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
