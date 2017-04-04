'use strict';

import Reactotron from 'reactotron-react-native';

class PixivAPI {

  auth(username: string, password: string) {
    const url = 'https://oauth.secure.pixiv.net/auth/token'
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'App-OS': 'ios',
      'App-OS-Version': '10.2.1',
      'App-Version': '6.7.1',
      'User-Agent': 'PixivIOSApp/6.7.1 (iOS 10.2.1; iPhone8,1)'
    }
    const body = {
      'get_secure_url': 1,
      'client_id': 'bYGKuGVw91e0NMfPGp44euvGt59s',
      'client_secret': 'HP3RmkgAmEGro0gn1x9ioawQE8WMfvLXDz3ZqxpK',
      'grant_type': 'password',
      'username': username,
      'password': password
    }

    // not work: 1508 Invalid grant_type parameter or parameter missing
    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then(function(token) {
      Reactotron.display({
        name: 'AuthToken',
        preview: 'auth',
        value: token
      })
      this.access_token = token.response.access_token
    })
  }

  get(url) {
    const headers = {
      'Accept': 'application/json',
      'App-OS': 'ios',
      'App-OS-Version': '10.2.1',
      'App-Version': '6.7.1',
      'User-Agent': 'PixivIOSApp/6.7.1 (iOS 10.2.1; iPhone8,1)'
    }
    return fetch(url, {
      method: 'GET',
      headers: headers
    })
    .then((response) => response.json())
  }
}

module.exports = PixivAPI;
