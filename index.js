import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import App from './App';
import { name as appName } from './app.json';
import store from './Src/Store';
import { AlreadyFilesExist, SendDataWhenOnline } from './Src/Store/Actions/PRoductAction';
import { useNetInfo } from "@react-native-community/netinfo"
import { openDatabase } from 'react-native-sqlite-storage';
store.dispatch(AlreadyFilesExist())
var db = openDatabase(
    { name: 'POS.db', location: "default" },
    () => console.log("SUusscessfullffffffffffffffffffffffff"),
    (e) => console.log("Error ", e)
);
function setupDATABASE() {
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Category'",
            [],
            function (tx, res) {
                console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS Category', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS Category(id INTEGER PRIMARY KEY AUTOINCREMENT, server_id INT(10), name_fr VARCHAR(500), image VARCHAR(255),isActive VARCHAR(255) )',
                        [],
                    );
                }
            },
        );
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Product'",
            [],
            function (tx, res) {
                console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS Product', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS Product(id INTEGER PRIMARY KEY AUTOINCREMENT, server_productid INT(10),name_fr VARCHAR(500),  price_euro INT(500), image VARCHAR(255),description VARCHAR(600) ,isActive VARCHAR(600) , quantity VARCHAR(600) , quantity_added VARCHAR(600) , catid INT(100) , FOREIGN KEY (catid) REFERENCES Category (id) )',
                        [],
                    );
                }
            },
        );
    });

}
setupDATABASE()
const AppRedux = () => {
    const netInfo = useNetInfo();
    let internet = React.useMemo(() => {
        return netInfo.isConnected
    }, [netInfo.isConnected])
    React.useEffect(() => {
        if (internet) {
            store.dispatch(SendDataWhenOnline())
        }
    }, [internet])
    return (
        <Provider {...{ store }}>
            <SafeAreaProvider>
                <App />
            </SafeAreaProvider>
        </Provider>
    )
};

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => AppRedux);



