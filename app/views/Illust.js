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
    const max_width = this.props.max_width
    console.log(illust.image_urls.square_medium)
    return(
      <TouchableHighlight style={{width: max_width, height: max_width}} underlayColor={'#f3f3f2'}
          onPress={()=>this.props.onSelected(this.props.illust)}>
        <Image source={{
            uri: illust.image_urls.square_medium,
            headers: {'Referer': 'https://app-api.pixiv.net/'},
            cache: 'force-cache' // iOS only
          }}
          style={{width: max_width, height: max_width, borderRadius: 8}} />
      </TouchableHighlight>
    )
  }
}
