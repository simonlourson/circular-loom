import { Request, Response, Application } from "express";
import express from 'express';
import path from 'path';
import axios, { AxiosRequestConfig } from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import raw from 'body-parser'

export class Routes {

  public routes(app: Application): void {

    //app.use(raw({type: 'application/octet-stream', limit : '2mb'}));
    app.route("/face/*").post(this.faces);
    app.route("/talend/statuses").post(this.statuses);

    app.use(express.static(path.join(__dirname, "public")));
    app.get('*', function(req, res){
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
  }

  public statuses(req: Request, res: Response) {
    console.log('Routes.statuses');
    console.log(req.body);
    console.log(req.headers);
    res.json({});
  }

  public faces(req: Request, res: Response) 
  {
    console.log('Routes.faces')
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
  }
}