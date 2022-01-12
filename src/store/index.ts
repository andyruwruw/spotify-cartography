import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import data from './modules/data';
import map from './modules/map';
import player from './modules/player';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    data,
    map,
    player,
  },
});
