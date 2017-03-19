'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  AppRegistry
} from 'react-native';

import AutoResponisve from 'autoresponsive-react-native';

import PixivAPI from './app/pixiv_api';
import Illust from './app/views/Illust';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_MARGIN = 2;

class PixivFan extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pagination: { loading: false, next_url: null },
      illusts: [],
      // ds: new ListView.DataSource({ rowHasChanged: (r1,r2) => r1 !== r2 })
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
      // ds: this.state.ds.cloneWithRows(illustsItems)
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

  getAutoResponsiveProps() {
    return {
      itemMargin: ITEM_MARGIN,
    };
  }

  renderChildren() {
    return this.state.illusts.map((illust) => {
      var ratio = illust.width > 0 ? illust.height / illust.width : 1
      var s_width = (SCREEN_WIDTH-2 - ITEM_MARGIN*2) / 2
      var s_height = parseInt(s_width * ratio)
      return (
        <View style={{width: s_width, height: s_height, marginLeft: 2, borderRadius: 8}} key={illust.id}>
          <Illust illust={illust} width={s_width} height={s_height}
            onSelected={(illust) => this.selectRow(illust)} />
        </View>
      );
    }, this);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.title}>Pixiv Rankings - week</Text>
        </View>
        <AutoResponisve {...this.getAutoResponsiveProps()}>
          {this.renderChildren()}
        </AutoResponisve>
      </ScrollView>
    )
  }

  componentWillMount() {
    this._getIllusts('week')
  }

  // _onRefresh() {
  //   console.log("_onRefresh")
  // }

  // _onEndReached() {
  //   this._getIllusts('week')
  // }

  selectRow(illust) {
    console.log(illust);
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
});

AppRegistry.registerComponent('PixivFan', () => PixivFan);

module.exports = PixivFan;
