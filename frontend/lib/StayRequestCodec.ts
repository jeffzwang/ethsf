import {  ContentTypeId } from '@xmtp/xmtp-js';

export const ContentTypeText = new ContentTypeId({
  authorityId: 'xmtp.org',
  typeId: 'text',
  versionMajor: 1,
  versionMinor: 0,
});

export type StayRequest = {
  startTime: string,
  endTime: string,
  price: string,
  guest: string,
  host: string,
  arbitrationDeadline: string,
  arbiter: string,
  tokenURI: string,
}

export type StayRequestApproval = {
  approvalSignature: string;
} & StayRequest;

// export class StayRequestCodec implements ContentCodec<StayRequest> {
//   get contentType
// }
