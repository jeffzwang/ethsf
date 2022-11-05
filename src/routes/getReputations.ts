import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-// import
dotenv.config();
import { Context } from 'koa';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import fetch from 'cross-fetch';

// const LENS_API_URL = 'https://api.lens.dev';
const LENS_API_URL = 'https://api-mumbai.lens.dev';

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

  if (result.data.profiles.items.length === 0) {
    ctx.message = 'Lens reputation not found.';
    ctx.status = 400;
    return;
  }

  ctx.status = 200;
  ctx.body = {
    lensFollowers: result.data.profiles.items[0].stats.totalFollowers,
  };
  ctx.message = 'Success';
};
