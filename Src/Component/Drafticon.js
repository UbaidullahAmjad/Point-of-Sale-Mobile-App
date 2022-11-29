import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
function Drafticon({ Cart, onPress }) {
    return (
        <View style={{ justifyContent: "center", marginLeft: wp('0.5%') }}>

            {Cart?.draft.length != 0 ? (
                <TouchableOpacity onPress={onPress}>
                    <AntDesign name='file1' size={wp('1.6%')} color={'#717171'} />
                    <View style={{
                        position: "absolute",
                        height: heightPercentageToDP('3%'),
                        width: heightPercentageToDP('3%'),
                        borderRadius: 200,
                        justifyContent: "center",

                        backgroundColor: 'rgba(40, 167, 69, 0.6)',
                        top: -heightPercentageToDP('0.8%'),
                        right: -heightPercentageToDP('1%')
                    }}>
                        <Text style={{ fontSize: heightPercentageToDP('1.5%'), color: "#fff", textAlign: "center" }}> {Cart?.draft.length}</Text>
                    </View>
                </TouchableOpacity>

            ) :
                <AntDesign name='file1' size={wp('1.6%')} color={'#717171'} />
            }
        </View>
    )
}
const mapStateToProps = ({ Cart }) => ({
    Cart
})

export default connect(mapStateToProps, {

})(Drafticon)