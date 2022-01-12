import { spotifyApi } from './request';

export const search = (query: string) => spotifyApi.search(
  query,
  ['album'],
  {
    limit: 5,
  },
);

export default {
  search,
};
