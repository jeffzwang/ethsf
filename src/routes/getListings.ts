import { Context } from 'koa';
import pinataSDK from '@pinata/sdk';
import axios from 'axios';
import { Listing } from '/src/lib/listing';

const pinata = new pinataSDK(process.env.PINATA_API_KEY!, process.env.PINATA_API_SECRET!);

export const getListings = async (
  ctx: Context,
) => {
  const pinataResp = await pinata.pinList({ metadata: { name: 'testing', keyvalues: {} } });
  console.log('pinataResp', pinataResp);
  // Go through and make sure that we are looking at JSON that is structured 
  // like we want.
  // Asynchronous go through pinataResp.rows
  let listings: Array<Listing> = [];
  await Promise.all(
    pinataResp.rows.map(async (row) => {
      const hash = row.ipfs_pin_hash;
      const resp = await axios.get('https://gateway.ipfs.io/ipfs/' + hash);
      // const resp = await axios.get('https://gateway.pinata.cloud/ipfs/' + hash);
      const data = resp.data;
      console.log('data', data);
      listings = data;
    }));
  ctx.status = 200;
  ctx.body = {
    listings,
  };
  ctx.message = 'Success';
};
