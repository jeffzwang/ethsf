import { Context } from 'koa';
import { auth } from '@iden3/js-iden3-auth';

import { PolygonIdVerificationContext } from '/src/lib/polygonIdVerificationContext';

export const getPolygonIdVerificationParams = async (
  ctx: Context,
) => {
  const hostUrl = 'https://b19d-199-116-74-105.ngrok.io';
  const sessionId = 1;
  const callbackURL = '/submitPolygonIdVerification';
  const audience = '1125GJqgw6YEsKFwj63GY87MMxPL9kwDKxPUiwMLNZ';

  const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

  // Generate request for basic auth
  const request = auth.createAuthorizationRequestWithMessage(
    'test flow',
    'message to sign',
    audience,
    uri,
  );

  request.id = '7f38a193-0918-4a48-9fac-36adfdb8b542';
  request.thid = '7f38a193-0918-4a48-9fac-36adfdb8b542';

  // Add query-based request
  const proofRequest = {
    id: 1,
    circuit_id: 'credentialAtomicQuerySig',
    rules: {
      query: {
        allowedIssuers: ['*'],
        schema: {
          type: 'AgeCredential',
          url: 'https://s3.eu-west-1.amazonaws.com/polygonid-schemas/9b1c05f4-7fb6-4792-abe3-d1ddbd9a9609.json-ld',
        },
        req: {
          dateOfBirth: {
            $lt: 20000101, // dateOfBirth field less then 2000/01/01
          },
        },
      },
    },
  };

  const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];

  // Store zk request in map associated with session ID

  const sessionKey = PolygonIdVerificationContext.generateSessionKey(request);
  sessionKey;
  ctx.status = 200;
  ctx.body = request;
  ctx.message = 'Success';
};
