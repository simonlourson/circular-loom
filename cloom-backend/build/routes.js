"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var Routes = /** @class */ (function () {
    function Routes() {
    }
    Routes.prototype.routes = function (app) {
        //app.use(raw({type: 'application/octet-stream', limit : '2mb'}));
        app.route("/face/*").post(this.faces);
        app.route("/talend/statuses").post(this.statuses);
        app.route("/activities").get(this.statuses);
        app.route("/activities").post(this.statuses);
        app.route("/talend/statuses").post(this.statuses);
        app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        app.get('*', function (req, res) {
            res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
        });
        /*
        let httpsAgent = new HttpsProxyAgent({host: "proxy-pc.na01.groupesigma.fr", port: "8080"});
        let config: AxiosRequestConfig = {
          method: 'post',
          url: 'https://face-circular-loom.cognitiveservices.azure.com/face/v1.0/detect?returnFaceLandmarks=true',
          data: {
            "url": "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg"
          },
          headers: {'Ocp-Apim-Subscription-Key': 'e45dd4f19490490e809f99c33d80faaf'},
          httpsAgent: httpsAgent,
          proxy: false
        }
        //axios(config).then((res) => console.log(res))
        */
    };
    Routes.prototype.statuses = function (req, res) {
        console.log('Routes.statuses');
        console.log(req.body);
        console.log(req.headers);
        res.json({});
    };
    Routes.prototype.faces = function (req, res) {
        console.log('Routes.faces');
        res.json({});
        /*
        console.log('Routes.faces')
        if (process.env.ENV_NAME == 'never')
        {
          
        }
        else
        {
          let httpsAgent = new HttpsProxyAgent({host: "proxy-pc.na01.groupesigma.fr", port: "8080"});
          let config: AxiosRequestConfig = {
            method: 'post',
            url: 'https://face-circular-loom.cognitiveservices.azure.com/face/v1.0/detect?returnFaceLandmarks=true',
            data: req.body,
            headers: {
              'Ocp-Apim-Subscription-Key': 'e45dd4f19490490e809f99c33d80faaf',
              'Content-Type': req.header('content-type')
            },
            httpsAgent: null,
            proxy: false
          }
          axios(config).then((faceRes) => res.json(faceRes.data))
        }
        */
    };
    return Routes;
}());
exports.Routes = Routes;
