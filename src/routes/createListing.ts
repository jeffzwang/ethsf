import { Context } from 'koa';
import pinataSDK from '@pinata/sdk';

export type ListingInfo = {
  hostAddress: string;
  ensName: string;
  referencesNumber: number;
  vouchesNumber: number;
  personalDescription: string;
  ipfsHash: string;
  voucherName: string;
  neighborhoodName: string;
  accommodationDescription: string;
  neighborhoodDescription: string;
  pricePerNight: string;
}

const pinata = new pinataSDK(process.env.PINATA_API_KEY!, process.env.PINATA_API_SECRET!);

export const createListing = async (
  ctx: Context,
) => {
  const bodyToPin = ctx.request.body;
  if (bodyToPin == null) {
    ctx.status = 501;
    ctx.message = 'no body';
    return;
  }

  // Check to make sure fields are ok.
  // if (bodyToPin.description == null || bodyToPin.pricePerNight == null || bodyToPin.images == null) {
  //   ctx.status = 501;
  //   ctx.message = 'Missing fields';
  //   return;
  // }

  const pinataResp = await pinata.pinJSONToIPFS(bodyToPin, { pinataMetadata: { 'type': 'listing' } });

  console.log('pinata pinned hash at ', pinataResp.IpfsHash);

  ctx.status = 200;
  ctx.body = {
    ipfsHash: pinataResp.IpfsHash,
  };
  ctx.message = 'Success';

  return;
};
