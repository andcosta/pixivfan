'use strict';

import FormData from 'form-data';

class PixivAPI {

  auth(username: string, password: string) {
    const url = 'https://oauth.secure.pixiv.net/auth/token'
    const headers = {
      'App-OS': 'ios',
      'App-OS-Version': '10.2.1',
      'App-Version': '6.7.1',
      'User-Agent': 'PixivIOSApp/6.7.1 (iOS 10.2.1; iPhone8,1)',
    }

    const form = new FormData()
    form.append('get_secure_url', 1)
    form.append('client_id', 'bYGKuGVw91e0NMfPGp44euvGt59s')
    form.append('client_secret', 'HP3RmkgAmEGro0gn1x9ioawQE8WMfvLXDz3ZqxpK')

    form.append('grant_type', 'password')
    form.append('username', username)
    form.append('password', password)

    var self = this;
    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: form,
      })
      .then((response) => response.json())
      .then(function(token) {
        self.access_token = token.response.access_token
        self.refresh_token = token.response.refresh_token
        return token.response
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
