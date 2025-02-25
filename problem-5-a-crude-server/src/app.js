const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const httpStatus = require('http-status');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const git = require('git-last-commit');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { responseHandler } = require('./middlewares/response');
const routes = require('./routes');

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());



app.options('*', cors());


app.use(responseHandler);

app.use('/ping', (req, res) => {
    git.getLastCommit((err, commit) => {
        res.send({
            message: 'Connected To Online Bookstore API',
            lastCommit: {
                hash: commit && commit.hash,
                committedOn: commit && commit.committedOn,
                shortHash: commit && commit.shortHash,
                branch: commit && commit.branch,
            },
        });
    });
});

// api routes
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res) => {
    const statusCode = httpStatus.NOT_FOUND;
    const response = {
        hasError: true,
        statusCode,
        message: 'Not found',
        data: {},
    };

    res.status(404).send(response);
});

// convert error to ApiError
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
