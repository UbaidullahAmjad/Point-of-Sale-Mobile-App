import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { ActivityIndicator, LogBox, Modal, PermissionsAndroid, StatusBar, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { connect } from 'react-redux'
import Home from './Src/Screen/Home'
import Splash from './Src/Screen/Splash'
import store from './Src/Store'
import { GetAlltheProductToExcel } from './Src/Store/Actions/PRoductAction'
const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs()

function App(props) {
  return (
    <View style={{ flex: 1, backgroundColor: "#F1F1F1" }}>
      <StatusBar hidden translucent />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          {/* {!props?.shared?.dataGated ? (
            <Stack.Screen name="Splash" component={Splash} />
          ) : */}
            <Stack.Screen name="Home" component={Home} />
          {/* } */}
        </Stack.Navigator>
      </NavigationContainer>

      <Toast />
      <Modal
        visible={props?.shared?.internetConnected}
        transparent={true}
      >
        <View style={{flex:1 , justifyContent:"center" , alignItems:'center' , backgroundColor:'rgba(0,0,0,0.5)'}}>
          <ActivityIndicator color={'#fff'} size='small' />

        </View>
        </Modal>
    </View>
  )
}
const mapStateToProps = ({ shared }) => ({

  shared
})

export default connect(mapStateToProps, {

})(App)
async function getPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      store.dispatch(GetAlltheProductToExcel())

    } else {
      console.log("Storage permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}