'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
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
      illusts: []
    }
  }

  componentWillMount() {
    this.api.auth('usersp', 'passsp')
      .then(function(response) {
        Reactotron.display({
          name: 'Login',
          preview: response.user.name,
          value: {response: response}
        })
      })

    // TO-DO: calc column number with screen width
    this.list_width = Dimensions.get('window').width
    this.columnNumber = 2
    this._getIllusts('week')
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
      illusts: illustsItems
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
      <FlatList
        data={this.state.illusts}
        keyExtractor={(illust: ItemT, index: number) => {
          return illust.id
        }}
        refreshing={false}
        onRefresh={() => {
          Reactotron.log('onRefresh')
          this.setState({
            pagination: { loading: false, next_url: null },
            illusts: []
          }, function afterReset () {
            Reactotron.log('Pull refreshing')
            this._getIllusts('week')
          })
        }}
        onEndReachedThreshold={1}
        onEndReached={({ distanceFromEnd }) => {
          Reactotron.log('onEndReached, load more')
          this._getIllusts('week')
        }}
        renderItem={({item}) => {
          return (
            <Illust illust={item}
              max_width={(this.list_width-2) / this.columnNumber}
              onSelected={(item) => this._onPress(item)} />
          )
        }}
        numColumns={this.columnNumber}
      />
    )
  }

  _onPress(illust) {
    Reactotron.display({
      name: 'IllustSelected',
      preview: illust.title,
      value: illust
    })
  }

};
