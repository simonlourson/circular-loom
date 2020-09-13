import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { Routes } from './routes';
class App
{
  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {

    // initialize configuration
    dotenv.config();
    console.log(process.env.ENV_NAME);


    // Create a new express application instance and add middleware
    this.app = express();
    
    this.app.use(express.json({type: 'application/json', limit:'1mb'}));
    this.app.use(express.raw({type: 'application/octet-stream', limit : '6mb'}));
    this.routePrv.routes(this.app);

  }

}

export default new App().app;
