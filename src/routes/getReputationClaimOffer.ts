import { Context } from 'koa';
import { ethers } from 'ethers';

export const getReputationClaimOffer = async (
  ctx: Context,
) => {
  const address = <string>ctx.request.body!.address;
  const signature = <string>ctx.request.body!.signature;
  const message = 'I am signing this message to prove that I own this address';

  const recovered = ethers.utils.verifyMessage(message, signature);

  if (recovered !== address) {
    ctx.status = 400;
    ctx.body = {
      error: 'Signature does not match address',
    };
    return;
  }

  ctx.status = 200;
  ctx.body = 'https://platform-test.polygonid.com/claim-link/06ba5682-5bf2-4f71-aa41-1552737f8e3f';
  ctx.message = 'Success';
};
