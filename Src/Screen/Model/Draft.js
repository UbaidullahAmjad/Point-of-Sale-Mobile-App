import { View, Text, Modal, TouchableOpacity, FlatList, } from 'react-native'
import React from 'react'
import { connect } from 'react-redux';
import { DataTable } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { DeleteDraft } from '../../Store/Actions/PRoductAction';
import moment from 'moment';
function Draft({ modalVisible, mainOnPress, Cart, DeleteDraft }) {
    return (
        <Modal
            visible={modalVisible}
            transparent={true}
        >
            <TouchableOpacity
                onPress={mainOnPress}
                activeOpacity={1}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    alignItems: "center",
                    justifyContent: "center",


                }}>
                <TouchableOpacity
                    // disabled={true}
                    zIndex={1}
                    activeOpacity={1}
                    style={{
                        overflow: 'hidden',
                        zIndex: 1
                    }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: widthPercentageToDP('1%'),
                        width: widthPercentageToDP('70%'),
                        height: heightPercentageToDP('70%'),
                        overflow: "hidden"
                    }}>
                        <Text style={{
                            fontSize: heightPercentageToDP('4%'), paddingHorizontal: "2%",
                            paddingVertical: '1.5%'
                        }}>Draft</Text>
                        <View style={{ height: 1, width: "100%", backgroundColor: 'silver', }} />

                        <FlatList
                            data={Cart?.draft.reverse()}
                            keyExtractor={(item, index) => index}
                            initialNumToRender={10}
                            ListHeaderComponent={() => {
                                return (
                                    <View style={{
                                        backgroundColor: '#F3F2F7',
                                        elevation: 3,
                                        borderRadius: 5,
                                    }}>
                                        <DataTable>
                                            <DataTable.Header>
                                                <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Date</DataTable.Title>
                                                <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Reference</DataTable.Title>
                                                <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Quantity</DataTable.Title>
                                                <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Grand Total (TND)</DataTable.Title>
                                                <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Action</DataTable.Title>
                                            </DataTable.Header>
                                        </DataTable>
                                    </View>
                                )
                            }}
                            ListFooterComponent={() => {
                                return (
                                    <View style={{ width: "100%", height: heightPercentageToDP('2.5%') }} />
                                )
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <DataTable>
                                        <DataTable.Row>
                                            <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>{moment(item?.draft_items[0]?.created_at).format('DD-MM-YYYY')}</DataTable.Cell>
                                            <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>{item?.draft_items[0]?.draft_id == null ? "Offline" : item?.draft_items[0]?.draft_id}</DataTable.Cell>
                                            <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>{item?.draft?.item_count}</DataTable.Cell>
                                            <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>{parseFloat(item?.draft?.grand_total).toFixed(2)}</DataTable.Cell>
                                            <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TouchableOpacity
                                                        onPress={() => DeleteDraft(item?.draft?.id, true, mainOnPress)}
                                                        style={{
                                                            borderRadius: widthPercentageToDP('0.5%'),
                                                            backgroundColor: '#34CEA7',
                                                            paddingVertical: heightPercentageToDP('1%'),
                                                            paddingHorizontal: heightPercentageToDP('1%')
                                                        }}>
                                                        <Feather name='edit' size={widthPercentageToDP('1.3%')} color='#fff' />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            if(item?.draft_items[0]?.draft_id == null){
                                                                DeleteDraft(item?.draft_items[0]?.offlineDraftId, false, true ,  mainOnPress)
                                                            }else{
                                                                DeleteDraft(item?.draft_items[0]?.draft_id, false, false ,  mainOnPress)
                                                            }
                                                           
                                                        }}
                                                        style={{
                                                            borderRadius: widthPercentageToDP('0.5%'),
                                                            backgroundColor: '#C82333',
                                                            paddingVertical: heightPercentageToDP('1%'),
                                                            paddingHorizontal: heightPercentageToDP('1%'),
                                                            marginLeft: widthPercentageToDP('0.3%')
                                                        }}>
                                                        <MaterialCommunityIcons name='delete' size={widthPercentageToDP('1.3%')} color='#fff' />
                                                    </TouchableOpacity>

                                                </View>
                                            </DataTable.Cell>

                                        </DataTable.Row>
                                    </DataTable>
                                )
                            }}
                        />
                    </View>

                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

const mapStateToProps = ({ Cart }) => ({
    Cart
})

export default connect(mapStateToProps, {
    DeleteDraft
})(Draft)