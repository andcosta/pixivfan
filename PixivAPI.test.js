'use strict';

import 'isomorphic-fetch' // for babel-node
import PixivAPI from './app/pixiv_api';

let api = new PixivAPI();
api.auth('usersp', 'passsp')
  .then((response) => {
    console.log(response)
  })
