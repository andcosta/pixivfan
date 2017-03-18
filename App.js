'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  RefreshControl,
  ActivityIndicator,
  AppRegistry
} from 'react-native';

import PixivAPI from './pixiv_api';

const LoadingIndicator = ({ loading }) => (
  loading ? (
    <View style={ styles.loading }>
      <ActivityIndicator
        animating={ true }
        style={[ styles.loading ]}
        size="large"
      />
    </View>
  ) : null
)

class PixivFan extends React.Component {

  constructor(props) {
    super(props)
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

    console.log('_getRankingSuccess')
    this._update(pagination, new_illusts)
  }

  _getRankingFailure(error) {
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
        console.log('loading incomplete, wait...')
        return
    }

    var url = this.state.pagination.next_url ? this.state.pagination.next_url
                                             : 'https://app-api.pixiv.net/v1/illust/ranking?mode=week&filter=for_ios'

    this._getRankingRequest()
    console.log('_getIllusts', url)
    PixivAPI.get(url)
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
      />
    )
  }

  _renderRow(row) {
    if (row.type === 'Loading') {
      return <LoadingIndicator loading={ row.loading } />
    } else {
      return (
        <View style={ styles.row }>
          <Text style={ styles.title }>{ row.title }</Text>
          <Text style={ styles.desc }>{ row.id }</Text>
        </View>
      )
    }
  }

  componentWillMount() {
    this._getIllusts('week')
  }

  _onRefresh() {
    console.log("_onRefresh")
  }

  _onEndReached() {
    this._getIllusts('week')
  }

};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#F5FCFF'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  row: {
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15
  },
  desc: {
    fontSize: 13
  }
});

AppRegistry.registerComponent('PixivFan', () => PixivFan);

module.exports = PixivFan;
