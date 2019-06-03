/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { PermissionsAndroid,StyleSheet, Text, View,NativeModules,DeviceEventEmitter} from 'react-native';




export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {location:{} };
  }

  componentDidMount() {
    let i=0;
    this.requestLocationPermission();
    DeviceEventEmitter.addListener("updateLocation", (geoData) => {
      this.setState({location:geoData});
      fetch('https://driver-appp.herokuapp.com/busLocation', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id:i,
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
          }),
        });
      i++;
    }); 
  }
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Msb Location Permission',
          message:
            'MSB needs access to your location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         this.startService();
      } else {
        //console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async startService(){
    try {
     let response = await NativeModules.GeoLocation.startService();
     //console.log(response);
    } catch (e) {
      //console.error(e);
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
          <Text>Welcome to MSB Location Service !!</Text>
          {
            this.state.location.coords?
            <View>
              <Text>{this.state.location.coords.latitude}</Text>
              <Text>{this.state.location.coords.longitude}</Text>
            </View>
            : null
          }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    },
});
