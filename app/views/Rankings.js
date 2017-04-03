'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  AppRegistry
} from 'react-native';

import Reactotron from 'reactotron-react-native';

import PixivAPI from '../pixiv_api';
import Illust from './Illust';


export default class Rankings extends Component {
  static navigationOptions = {
    title: 'Rankings',
  };

  constructor(props) {
    super(props)
    this.api = new PixivAPI();
    this.state = {
      pagination: { loading: false, next_url: null },
      illusts: [],
      ds: new ListView.DataSource({ rowHasChanged: (r1,r2) => r1 !== r2 })
    }
  }

  _getRankingRequest() {
    const pagination = { ...this.state.pagination, loading: true }
    this._update(pagination)
  }

  _getRankingSuccess(responseData) {
    const pagination = { ...this.state.pagination, loading: false, next_url: responseData.next_url }
    const new_illusts = this.state.illusts ? [ ...this.state.illusts, ...responseData.illusts ] : responseData.illusts

    Reactotron.display({
      name: 'getRankingSuccess',
      preview: responseData.next_url,
      value: {pagination: pagination, illusts: new_illusts},
      important: true
    })
    this._update(pagination, new_illusts)
  }

  _getRankingFailure(error) {
    Reactotron.error({message: '_getRankingFailure', error: error})
    const pagination = { ...this.state.pagination, loading: false }
    this._update(pagination)
  }

  _update(pagination, illusts = null) {
    const illustsItems = illusts || this.state.illusts
    this.setState({
      pagination: pagination,
      illusts: illustsItems,
      ds: this.state.ds.cloneWithRows(illustsItems)
    })
  }

  _getIllusts(mode) {
    if (this.state.pagination.loading) {
      Reactotron.log('loading incomplete, wait...')
      return
    }

    var url = this.state.pagination.next_url ? this.state.pagination.next_url
                                             : 'https://app-api.pixiv.net/v1/illust/ranking?mode=week&filter=for_ios'

    Reactotron.display({
      name: 'getIllusts',
      preview: url,
      value: url
    })

    this._getRankingRequest()
    this.api.get(url)
      .then(responseData => this._getRankingSuccess(responseData))
      .catch(error => this._getRankingFailure(error))
  }

  render() {
    return (
      <ListView
        enableEmptySections={ true }
        automaticallyAdjustContentInsets={ false }
        dataSource={ this.state.ds }
        renderRow={ row => this._renderRow(row) }
        refreshControl={
          <RefreshControl
            refreshing={ false }
            onRefresh={ () => this._onRefresh() }
          />
        }
        onEndReached={ () => this._onEndReached() }
        // make ListView as GridView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      />
    )
  }

  _renderRow(illust) {
    const columnNumber = 2
    const {height, width} = Dimensions.get('window');
    return (
      <Illust illust={illust}
        max_width={(width-2) / columnNumber}
        onSelected={(illust) => this.selectRow(illust)} />
    )
  }

  componentWillMount() {
    Reactotron.warn('componentWillMount')
    this._getIllusts('week')
  }

  _onRefresh() {
    Reactotron.log('_onRefresh')
  }

  _onEndReached() {
    Reactotron.log('_onEndReached')
    this._getIllusts('week')
  }

  selectRow(illust) {
    Reactotron.display({
      name: 'IllustSelected',
      preview: illust.title,
      value: illust
    })
  }

};
