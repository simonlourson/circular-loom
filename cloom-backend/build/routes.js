"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var axios_1 = __importDefault(require("axios"));
var https_proxy_agent_1 = require("https-proxy-agent");
var Routes = /** @class */ (function () {
    function Routes() {
    }
    Routes.prototype.routes = function (app) {
        //app.use(raw({type: 'application/octet-stream', limit : '2mb'}));
        app.route("/face/*").post(this.faces);
        app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        app.get('*', function (req, res) {
            res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
        });
        var httpsAgent = new https_proxy_agent_1.HttpsProxyAgent({ host: "proxy-pc.na01.groupesigma.fr", port: "8080" });
        var config = {
            method: 'post',
            url: 'https://face-circular-loom.cognitiveservices.azure.com/face/v1.0/detect?returnFaceLandmarks=true',
            data: {
                "url": "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg"
            },
            headers: { 'Ocp-Apim-Subscription-Key': 'e45dd4f19490490e809f99c33d80faaf' },
            httpsAgent: httpsAgent,
            proxy: false
        };
        //axios(config).then((res) => console.log(res))
    };
    Routes.prototype.faces = function (req, res) {
        console.log('Routes.faces');
        if (process.env.ENV_NAME == 'never') {
        }
        else {
            var httpsAgent = new https_proxy_agent_1.HttpsProxyAgent({ host: "proxy-pc.na01.groupesigma.fr", port: "8080" });
            var config = {
                method: 'post',
                url: 'https://face-circular-loom.cognitiveservices.azure.com/face/v1.0/detect?returnFaceLandmarks=true',
                data: req.body,
                headers: {
                    'Ocp-Apim-Subscription-Key': 'e45dd4f19490490e809f99c33d80faaf',
                    'Content-Type': req.header('content-type')
                },
                httpsAgent: null,
                proxy: false
            };
            axios_1.default(config).then(function (faceRes) { return res.json(faceRes.data); });
        }
    };
    return Routes;
}());
exports.Routes = Routes;
