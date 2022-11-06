import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-// import dotfile
dotenv.config();
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from '@koa/router';
import { getListings } from '/src/routes/getListings';
import { createListing } from '/src/routes/createListing';
import { submitPolygonIdVerification } from '/src/routes/submitPolygonIdVerification';
import { getPolygonIdVerificationParams } from '/src/routes/getPolygonIdVerificationParams';
import { getReputations } from '/src/routes/getReputations';
import { getReputationClaimOffer } from '/src/routes/getReputationClaimOffer';

const main = async () => {
  const app = new Koa();
  const router = new Router();

  app.use(cors({
    maxAge: 86400,
  }));
  app.use(bodyParser({ formLimit: '1mb', jsonLimit: '1mb', textLimit: '1mb' }));

  router.post('/getListings', getListings);
  router.post('/createListing', createListing);
  router.post('/getPolygonIdVerificationParams', getPolygonIdVerificationParams);
  router.post('/submitPolygonIdVerification', submitPolygonIdVerification);
  router.post('/getReputations', getReputations);
  router.post('/getReputationClaimOffer', getReputationClaimOffer);

  app.use(router.routes());

  const port = 3001;
  app.listen(port, '0.0.0.0');

  console.log(`Running on port ${port}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
