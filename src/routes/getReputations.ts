import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-// import
dotenv.config();
import { Context } from 'koa';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import fetch from 'cross-fetch';
import axios from 'axios';

// const LENS_API_URL = 'https://api.lens.dev';
const LENS_API_URL = 'https://api-mumbai.lens.dev';

const COVALENT_API_KEY = process.env.COVALENT_API_KEY!;

const query = gql`
  query MyQuery($ownedBy: [EthereumAddress!] = "0x2E21f5d32841cf8C7da805185A041400bF15f21A") {
    profiles(request: {ownedBy: $ownedBy}) {
      items {
        id
        bio
        ownedBy
        stats {
          totalFollowers
          totalFollowing
        }
        onChainIdentity {
          ens {
            name
          }
          proofOfHumanity
          worldcoin {
            isHuman
          }
        }
      }
    }
  }
`;

export const apolloClient = new ApolloClient({
  uri: LENS_API_URL,
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: LENS_API_URL + '/graphql', fetch }),
});

export const getReputations = async (
  ctx: Context,
) => {
  const body = ctx.request.body;
  if (body == null || body.address == null) {
    ctx.message = 'Address not found.';
    ctx.status = 400;
    return;
  }

  // Find Lens reputation.
  const result = await apolloClient.query({
    query: query,
    variables: {
      ownedBy: body.address,
    }
  });

  let lensFollowers;
  if (result.data.profiles.items.length !== 0) {
    lensFollowers = result.data.profiles.items[0].stats.totalFollowers;
  }

  // Convert the following curl to an axios request.
  // curl -X GET https://api.covalenthq.com/v1/:chain_id/address/:address/transactions_v2/?&key=ckey_af5694ac56a74c0999ab5da2b97
  // \ -H "Accept: application/json"
  const resp = await axios.get(`https://api.covalenthq.com/v1/1/address/${body.address}/transactions_v2/?&key=${COVALENT_API_KEY}`);
  const numTransactions = resp.data.data.items.length;

  ctx.status = 200;
  ctx.body = {
    lensFollowers,
    numTransactions,
  };
  ctx.message = 'Success';
};
