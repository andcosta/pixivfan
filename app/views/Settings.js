'use strict';

import React, {
  Component,
} from 'react';

import {
  Modal,
  View,
  Text,
  TextInput,
  Picker,
  DatePickerIOS,
  StyleSheet,
  Dimensions,
} from 'react-native';

import DatePicker from 'react-native-datepicker'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Reactotron from 'reactotron-react-native';

var css = require("./CommonStyles");
var GlobalStore = require('../GlobalStore');

class WithLabel extends Component {
  render() {
    return (
      <View style={[css.row, css.center]}>
        <View>
          <Text>{this.props.label}</Text>
        </View>
        {this.props.children}
      </View>
    );
  }
}

var RANKING_MODES = [
  'day', 'week', 'month', 'day_male', 'day_female', 'week_original', 'week_rookie',
  'day_r18', 'day_male_r18', 'day_female_r18', 'week_r18', 'week_r18g',
];

export default class Settings extends Component {

  constructor(props) {
    super(props);

    const now = new Date();
    this.state = {
      username: null,
      password: null,
      mode: 'week',
      date: now,
    };
  }

  componentDidMount() {
    GlobalStore.reloadSettings()
      .then(() => {
        this.setState(GlobalStore.settings);
      });
  }

  componentWillReceiveProps(props) {
    if (props.visible == false) {
      GlobalStore.saveSettings(this.state);   // onClose, sync state to AsyncStorage
    }
  }

  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onClose}
        >
        <View style={[css.center, {flex: 1, backgroundColor: '#FFFFFF'}]}>
          <View style={[css.row, css.center]}>
            <View>
              <Text>Username:</Text>
            </View>
            <TextInput style={{height: 24, width: width/2, borderColor: 'gray', borderWidth: 1}}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="username"
              onChangeText={(text) => this.setState({username: text})}
              value={this.state.username}
            />
          </View>

          <WithLabel label="Password:">
            <TextInput
              style={{height: 24, width: width/2}}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              placeholder="password"
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password} />
          </WithLabel>

          <WithLabel label="Mode:">
            <Text>{this.state.mode}</Text>
          </WithLabel>
          <Picker
            style={{width: width}}
            selectedValue={this.state.mode}
            onValueChange={(value) => this.setState({mode: value})}>
            {RANKING_MODES.map((mode) => (
              <Picker.Item key={mode} value={mode} label={mode} />
            ))}
          </Picker>

          <WithLabel label="Date:">
            <Text>{this.state.date}</Text>
          </WithLabel>
          <DatePicker
            style={{width: width}}
            date={this.state.date}
            mode="date"
            format="YYYY-MM-DD"
            minDate="2000-01-01"
            customStyles={{
              dateIcon: {
                marginLeft: 4,
                marginRight: 24
              },
              dateInput: {
                marginLeft: 32
              }
            }}
            onDateChange={(date) => this.setState({ date: date })} />

          <FontAwesome.Button name="check" size={20}
            color="#000000"
            backgroundColor="#CCCCCC"
            onPress={this.props.onClose}
          >
            Save
          </FontAwesome.Button>

          <FontAwesome.Button name="remove" size={20}
            color="#FF0000"
            backgroundColor="#CCCCCC"
            onPress={() => { GlobalStore.reset() }}
          >
            Reset
          </FontAwesome.Button>
        </View>
      </Modal>
    );
  }
}

var styles = StyleSheet.create({
  textinput: {
    height: 26,
    width: 50,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    padding: 4,
    fontSize: 13,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  labelView: {
    marginRight: 10,
    paddingVertical: 2,
  },
  label: {
    fontWeight: 'bold',
  },
});
