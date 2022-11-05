import { protocol } from '@iden3/js-iden3-auth';


class PolygonIdVerificationContextClass {
  maxSessionKey: number;
  requestBySessionKey: Record<number, protocol.AuthorizationRequestMessage>;

  constructor() {
    this.requestBySessionKey = {};
    this.maxSessionKey = 0;
  }

  generateSessionKey(request: protocol.AuthorizationRequestMessage) {
    this.requestBySessionKey[this.maxSessionKey++] = request;
    return this.maxSessionKey;
  }

  isValidSessionKey(key: number) {
    return this.requestBySessionKey[key] !== undefined;
  }

  consumeSessionKey(key: number) {
    if (!this.isValidSessionKey(key)) {
      throw new Error('Invalid session key');
    }
    delete this.requestBySessionKey[key];
  }
}

const PolygonIdVerificationContext = new PolygonIdVerificationContextClass()

export {
  PolygonIdVerificationContext,
}