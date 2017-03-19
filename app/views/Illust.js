'use strict';

import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
} from 'react-native';

export default class Illust extends Component {
  render() {
    const illust = this.props.illust
    return(
      <TouchableHighlight style={{width: this.props.width, height: this.props.height, borderRadius: 8}} underlayColor={'#f3f3f2'}
          onPress={()=>this.props.onSelected(this.props.illust)}>
        <Image source={{
            uri: illust.image_urls.medium,
            headers: {'Referer': 'https://app-api.pixiv.net/'},
            cache: 'only-if-cached' // iOS only
          }}
        style={{width: this.props.width, height: this.props.height, borderRadius: 8}} />
      </TouchableHighlight>
    )
  }
}
