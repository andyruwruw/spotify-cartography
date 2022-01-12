import { spotifyApi } from './request';

export const search = (query: string) => spotifyApi.search(
  query,
  ['playlist'],
  {
    limit: 20,
  },
);

export default {
  search,
};
