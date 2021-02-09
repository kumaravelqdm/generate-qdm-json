var express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const { postgraphile, makePluginHook } = require("postgraphile");
const { postgraphilePolyRelationCorePlugin } = require('postgraphile-polymorphic-relation-plugin');
const { default: PgPubsub } = require("@graphile/pg-pubsub");
const pluginHook = makePluginHook([PgPubsub]);
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const PgOrderByRelatedPlugin = require("@graphile-contrib/pg-order-by-related");
const { convertJson } = require("./functions/json_conversion")
var app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let connString = {
    host: "localhost",
    user: "postgres",
    password: "kumaravel@123",
    database: "qdm-poc",
    port: 5432
}

app.use(
    postgraphile(connString, {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
        pluginHook,
        subscriptions: true,
        simpleSubscriptions: true,
        appendPlugins: [
            ConnectionFilterPlugin, PgOrderByRelatedPlugin, postgraphilePolyRelationCorePlugin
        ],
        graphileBuildOptions: {
            connectionFilterRelations: true, // default: false
        },
    })
);


app.post('/login', async function (req, res) {
    const { username, password } = req.body;
    if (username == 'test@crayond.com' && password == '12345678') {
        res.send({
            status: 200,
            msg: "success"
        });
    } else {
        res.status(400).send({
            status: 400,
            msg: "bad request"
        });
    }
})

app.post('/generate-json', async function (req, res) {
    const { input } = req.body;
    let data = convertJson(input)
    res.status(200).send({
        status: 200,
        msg: "success",
        converted_json: data
    });
})


let PORT = 8000;
app.listen(PORT, function () {
    console.log(`app listening on port ${PORT}!`);
});