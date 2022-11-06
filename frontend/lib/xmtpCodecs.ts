import { ContentCodec, ContentTypeId, EncodedContent } from '@xmtp/xmtp-js';
import { StayRequest, StayRequestApproval } from '/lib/stayTypes';

export const ContentTypeStayRequest = new ContentTypeId({
  authorityId: 'useglider.xyz',
  typeId: 'stayRequest',
  versionMajor: 1,
  versionMinor: 0,
})

export const ContentTypeStayRequestApproval = new ContentTypeId({
  authorityId: 'useglider.xyz',
  typeId: 'stayRequestApproval',
  versionMajor: 1,
  versionMinor: 0,
})

export class StayRequestCodec implements ContentCodec<StayRequest> {
  get contentType(): ContentTypeId {
    return ContentTypeStayRequest;
  }

  encode(content: StayRequest): EncodedContent {
    return {
      type: ContentTypeStayRequest,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(content)),
    }
  }

  decode(content: EncodedContent): StayRequest {
    return JSON.parse(new TextDecoder().decode(content.content));
  }
}

export class StayRequestApprovalCodec implements ContentCodec<StayRequestApproval> {
  get contentType(): ContentTypeId {
    return ContentTypeStayRequestApproval;
  }

  encode(content: StayRequestApproval): EncodedContent {
    return {
      type: ContentTypeStayRequestApproval,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(content)),
    }
  }

  decode(content: EncodedContent): StayRequestApproval {
    return JSON.parse(new TextDecoder().decode(content.content));
  }
}