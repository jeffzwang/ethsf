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
  pricePerNight: number;
  lensFollowers: number;
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

  const pinataResp = await pinata.pinJSONToIPFS(bodyToPin, { pinataMetadata: { 'type': 'listing', 'name': 'testing' } });

  console.log('pinata pinned hash at ', pinataResp.IpfsHash);

  ctx.status = 200;
  ctx.body = {
    ipfsHash: pinataResp.IpfsHash,
  };
  ctx.message = 'Success';

  return;
};
