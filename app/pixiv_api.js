'use strict';

export default class PixivAPI {
  constructor() {
    this.headers = {
      'Accept': 'application/json',
      'App-OS': 'ios',
      'App-OS-Version': '10.2.1',
      'App-Version': '6.6.2',
      'User-Agent': 'PixivIOSApp/6.6.2 (iOS 10.2.1; iPhone8,1)'
    }
  }

  get(url) {
    return fetch(url, {
      method: 'GET',
      headers: this.headers
    })
    .then((response) => response.json())
  }

}
