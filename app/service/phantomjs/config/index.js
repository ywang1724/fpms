var path = require("path");
module.exports = {
    phantomConfig: {
        page: {
            viewportSize: {
                width: 1440,
                height: 900
            },
            settings: {
                resourceTimeout: 20000,
                userAgent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36"
            }
        },
        path: {
            root: path.join(process.cwd(), "temp"), // data and screenshot save path root
        },
        render: {
            format: 'jpeg',     // @see http://phantomjs.org/api/webpage/method/render.html
            quality: 100,        // @see http://phantomjs.org/api/webpage/method/render.html
            ext: 'jpg',         // the same as format, if not specified
        },
        walk: {
            excludeSelectors: []
        },
        domRules: ["domrules"]
    },
    rabbitURI:  process.env.rabbitURI || "amqp://localhost",
    mongodbURI:  process.env.mongodbURI || "mongodb://192.168.88.34/fpms"
}
