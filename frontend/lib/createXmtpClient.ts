import { BigNumber, ethers, Signer } from 'ethers';
import { Conversation, DecodedMessage, Stream, Client, SendOptions } from '@xmtp/xmtp-js'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';
import { StayRequestCodec, StayRequestApprovalCodec, ContentTypeStayRequest, ContentTypeStayRequestApproval, } from '/lib/xmtpCodecs';


const encodeXmtpKey = (arr: Uint8Array): string => {
  return Array.from(arr).map(x => String.fromCharCode(x)).join('');
}

const decodeXmtpKey = (val: string): Uint8Array => {
  return new Uint8Array(val.split('').map(x => x.charCodeAt(0)));
}

const createXmtpClient = async (signer: ethers.Signer, address: string, callback: Function) => {
  const cachedPrivateKey = window.localStorage.getItem(`xmtpKey_${address}`);
  let keys: Uint8Array;
  if (!cachedPrivateKey) {
    console.log('no cache!')
    keys = await Client.getKeys(signer);
    writeStorage(`xmtpKey_${address}`, encodeXmtpKey(keys));
  } else {
    keys = decodeXmtpKey(cachedPrivateKey);
  }

  const client = await Client.create(null, { privateKeyOverride: keys, codecs: [new StayRequestCodec(), new StayRequestApprovalCodec()] });
  callback(client);
  return client;
}

export {
  createXmtpClient,
  encodeXmtpKey,
  decodeXmtpKey,
}