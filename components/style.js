import { StyleSheet, Dimensions } from "react-native";

const window = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fff',
    position:'relative'
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#cdd016',
    borderRadius: 15,
    flexDirection: 'column',
    height: window.height,
    overflow: 'hidden',
    paddingVertical: window.height * 0.04,
    paddingHorizontal: window.width * 0.01,
    position: 'relative',
    width: window.width,
    justifyContent: 'flex-start',
  },
  loginSection: {
    alignItems: 'center',
    flexDirection: 'column',
    marginVertical: window.height * 0.02,
    position: 'relative',

  },
  textLogin: {
    color: '#000000',
    fontSize: window.height * 0.03,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: window.height * 0.0325,
    marginTop: -1,
    marginBottom: window.height * 0.01,
    position: 'relative',
    overflow: 'hidden',
  },
  textWelcomePage: {
    textAlign: 'justify',
    fontSize: window.height * 0.015,
    flexWrap: 'wrap',
  },
  registerButton: {
    height: window.height * 0.06,
    marginRight: -2,
    position: 'relative',
    width: window.width * 0.9,
  },
  overlapGroup: {
    backgroundColor: '#00ff00',
    borderRadius: 15,
    height: window.height * 0.06,
    marginTop: window.height * 0.01,
    position: 'relative',
    width: window.width * 0.89,
  },
  textSignUp: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
    left: window.width * 0.075,
    letterSpacing: 0,
    lineHeight: window.height * 0.0225,
    position: 'absolute',
    textAlign: 'center',
    top: window.height * 0.0210,
    overflow: 'hidden',
  },
  containerGoogle: {
    margin:10,
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: window.width * 0.025,
    shadowColor: '#000',
    height: window.height *0.07,
    shadowOffset: {
      width: 0,
      height: window.height * 0.01,
    },
    shadowOpacity: 0.3,
    shadowRadius: window.width * 0.015,
    elevation: 3,
    padding: window.height * 0.015,
    position: 'relative',
    width: window.width * 0.89,
  },
  containerFb: {
    margin:10,
    backgroundColor: '#1877f2',
    height: window.height *0.07,
    borderRadius: window.width * 0.025,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: window.height * 0.01,
    },
    shadowOpacity: 0.3,
    shadowRadius: window.width * 0.015,
    elevation: 3,
    justifyContent: 'flex-start',
    padding: window.height * 0.015,
    position: 'relative',
    width: window.width * 0.89,
  },
  googleText: {
    color: '#0000008a',
    fontSize: window.height * 0.03,
    paddingLeft: window.width * 0.05,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: window.height * 0.0325,
    marginTop: -1,
    position: 'relative',
    overflow: 'hidden',
  },
  fbText: {
    color: '#ffffff',
    fontSize: window.height * 0.03,
    paddingLeft: window.width * 0.05,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: window.height * 0.0325,
    marginTop: -1,
    position: 'relative',
    overflow: 'hidden',
  },
  bigLogo:{
     marginTop: window.height*0.35,
     width: window.width*0.98, 
     height: window.height*0.23, 
     borderRadius: 20, 
     margin: 5,
      resizeMode:'stretch',
  },
  wrapperSelectAndImg:{
    justifyContent:'space-between',
    flexDirection:'row',
    backgroundColor:'white'
  },
  arrowImg:{
    width: window.width*0.135, 
    height: window.height*0.068, 
    marginTop: window.height*0.005,
    marginRight: window.height*0.02,
    marginBottom: window.height*0.005
 },
  textAreaTask:{
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    fontSize: 15 
  },
  containerAddUser:{
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: '#F1F1F1'
  },
  wrapperAdd: {
    flexDirection: 'column',
    backgroundColor: '#F1F1F1',
    flex: 0.15,
    justifyContent:'flex-end',
    alignItems: 'center',
    paddingBottom: window.height * 0.1, 
  },
  textButtonsAdd:{
    color: 'white',
    fontWeight:'bold',
    fontSize: 20,
  },
  textAddFriend: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: window.height * 0.02,
  },

  containerInputAddFriend: {
    backgroundColor: 'white',
    padding:10,
    borderRadius: 10,
    height: window.height * 0.08,
    width: window.width * 0.8,
    marginTop:window.height*0.02,
    marginBottom:window.height*0.02
  },
  buttonsAddUser:{
    justifyContent:'center',
    alignItems:'center',
    height: window.height * 0.08,
    width: window.width * 0.35,
    backgroundColor:'#E12828',
    borderRadius: 10
  },
  containerAddButtons: {
    flexDirection: 'row',
    justifyContent:'space-around',
  },
  textNameFriend:{
    fontSize: 18
  },
  containerInputsAdd:{
    height:window.height*0.3,
    marginTop:window.height*0.02,
    marginBottom:window.height*0.02,
    justifyContent:'space-around',
    alignItems:'center'
  },
  infoTextProfile:{
    fontSize:20,
    fontWeight:'bold'
  },
  infoTextProfileSpecified:{
    fontSize:20,
    fontWeight:'regular',
    marginLeft: window.width*0.1
  },
  textChatsLine:{
    color: 'white',
    fontSize: 16,
    textAlign:'center',
    textDecorationLine: 'underline',
  },
  textChatsNoLine:{
    color: 'white',
    fontSize: 16,
    textAlign:'center'
  },
  messImg:{
    width: window.width*0.15, 
    height: window.height*0.075, 
    marginTop: window.height*0.005,
    marginRight: window.height*0.02,
    marginBottom: window.height*0.005
  },
  messImgSmall:{
    width: window.width*0.1, 
    height: window.height*0.05, 
    marginTop: window.height*0.005,
    marginRight: window.height*0.02,
    marginBottom: window.height*0.005
  },
  textChats2:{
    fontSize: 16,
    width: window.width*0.9,
    textAlign:'center'
  },
  page: {
    backgroundColor: '#CDD016',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerLogo: {
    width: window.width,
    resizeMode: 'contain',
    marginTop: window.height*0.033,
  },
  titleDesText: {
    fontSize: window.height*0.02,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  titleText: {
    fontSize: window.height*0.05,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    textAlign: 'center',
    fontSize: window.height*0.015,
    margin: 5,
  },
  continueButton: {
    backgroundColor: '#E12828',
    borderRadius: 22,
    marginBottom: 15,
    width: window.width*0.32,
    height: window.height*0.053,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bodyText: {
    textAlign: 'justify',
    fontSize: window.height*0.0125,
    color: 'black',
    flex: 1,
    marginHorizontal: 10,
  },
  upperContainerText: {
    marginVertical: 20,

  },
  dotsMenu:{
    position: 'absolute', 
    top: window.height*0.57, 
    right: window.width*0.01, 
    width: window.width*0.38, 
    height: window.height*0.15, 
    resizeMode: 'contain',
    borderWidth:0.5,
    borderRadius: 10,
    padding: 10,
  },
  priorityMenu:{
    position: 'absolute', 
    top: window.height*0.55, 
    right: window.width*0.01, 
    width: window.width*0.4, 
    height: window.height*0.2, 
    resizeMode: 'contain',
  },
  containerHeader:{
    backgroundColor: '#CDD016',
    flex: 0.15,
    height: window.height*0.13,
    width: window.width*1,
    marginBottom: 1
},
container2:{
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    height: window.height*0.13,
    width: window.width*1,
    margin: window.height*0.01,
}, 
textHeader:{
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 19
},
headerLogo2:{
    width: window.width*0.29, 
    height: window.height*0.07, 
    borderRadius: 20, 
    margin: window.height*0.01,
    resizeMode:"stretch",
 },
 uploadContainer:{
    justifyContent:'space-evenly',
    flexDirection:'row',
    alignItems:'center',
    marginBottom:3
 },
  text:{
    fontSize:16
  },
  containerPressChat:{
    flex:1,
    borderLeftWidth:1, 
    borderColor:'white', 
    justifyContent:'center', 
    alignItems:'center'
  },
  containerXChat:{
    flex:0.4,
    justifyContent:'center',
    alignItems:'center'
  },
  wrapperChatPress:{
    height:window.height*0.07,
    justifyContent:'space-evenly',
    flexDirection:'row', 
    backgroundColor:'#CDD016'
  },
  iconsContainer: {
    position: 'absolute',
    bottom: window.height*0.05,
    right: 20,
  },
  icon: {
    marginVertical: 5,
  },
  userPhoto: {
    width: window.width*0.175,
    height: window.height*0.085,
    borderRadius: 50,
    marginRight: 20,
    resizeMode:'contain'
  },
  groupContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    padding: 10
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
});