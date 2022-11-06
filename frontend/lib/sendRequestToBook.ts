import { ethers } from "ethers";
import { createXmtpClient } from "/lib/createXmtpClient";
import { StayRequest } from "/lib/stayTypes";
import { ContentTypeStayRequest } from "/lib/xmtpCodecs";

const sendRequestToBook = async (signer: ethers.Signer, stay: StayRequest) => {
  const {
    host
  } = stay;
  const address = await signer.getAddress();
  const client = await createXmtpClient(signer, address, () => { })
  const convo = await client.conversations.newConversation(host);
  return await convo.send(stay, {
    contentType: ContentTypeStayRequest,
    contentFallback: 'useglider.xyz'
  })
}

export {
  sendRequestToBook,
}