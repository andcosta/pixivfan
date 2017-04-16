'use strict';

import {
  AsyncStorage
} from 'react-native';

import Reactotron from 'reactotron-react-native';

class GlobalStore {
  initState() {
    return {
      currentMode: null,
    };
  }

  constructor() {
    const now = new Date();
    const start_date = new Date(now.setDate(now.getDate()-2)); // pixiv delay return, so date-2
    this.settings = {
      username: 'usersp',
      password: 'passsp',
      mode: 'week',
      date: start_date.toJSON().slice(0,10),
    };
    this.state = this.initState();
  }

  async _reloadSettings() {
    const setting_string = await AsyncStorage.getItem('settings');
    if (setting_string !== null){
      this.settings = JSON.parse(setting_string);
    }
    this.state = this.initState();
  }

  reloadSettings() {
    return this._reloadSettings();
  }

  saveSettings(settings) {
    this.settings = settings;
    AsyncStorage.setItem('settings', JSON.stringify(this.settings), () => {
      Reactotron.display({
        name: 'AsyncStorage',
        preview: `mode=${this.settings.mode} date=${this.settings.date}`,
        value: {settings: this.settings}
      })
    });
  }

  reset() {
    AsyncStorage.removeItem('settings')
  }
}

module.exports = new GlobalStore();
