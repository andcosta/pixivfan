'use strict';

import React, { Component } from 'react';
import {
  View,
  AppRegistry
} from 'react-native';

import './app/ReactotronConfig';
import Rankings from './app/views/Rankings';

class App extends Component {
  render() {
    return (
      <Rankings />
    );
  }
}

AppRegistry.registerComponent('App', () => App);

module.exports = App;
