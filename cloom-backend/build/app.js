"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var routes_1 = require("./routes");
var App = /** @class */ (function () {
    function App() {
        this.routePrv = new routes_1.Routes();
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        var testComplexType = {
            testInfo1: "testValue1",
            testInfo2: "testValue2",
            testNestedInfo: {
                testNested1: "testNestedValue1",
                testNested2: "testNestedValue2"
            }
        };
        console.log(JSON.stringify(testComplexType));
        // Create a new express application instance and add middleware
        this.app = express_1.default();
        this.app.use(express_1.default.json({ type: 'application/json', limit: '1mb' }));
        this.app.use(express_1.default.raw({ type: 'application/octet-stream', limit: '6mb' }));
        this.routePrv.routes(this.app);
    }
    return App;
}());
exports.default = new App().app;
