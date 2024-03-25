import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { text } from '../assets/text/WelcomeScreenText.js';
import {styles} from './style.js'
const window = Dimensions.get('window');

const CircleWithText = ({ text }) => {
    return (
        <View style={{
            margin: 5,
            width: window.width*0.32,
            height: window.width*0.32,
            backgroundColor: '#00FF00',
            borderRadius: 35,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{
                width: window.width*0.245,
                height: window.width*0.245,
                backgroundColor: '#FFFFFF',
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Text style={styles.circleText}>{text}</Text>
            </View>
        </View>
    );
};

const ContinueButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.continueButton} onPress={onPress}>
            <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>


    );
};

export default function WelcomePage({ navigation }) {
    return (
        <View style={styles.page}>
            <Image style={styles.headerLogo} source={require('../assets/images/logo.png')} />

            <View style={styles.upperContainerText}>
            <Text style={styles.titleDesText}>Improve your workflow with</Text>
            <Text style={styles.titleText}>Whale Notes</Text>
            </View>

            <View style={styles.circleContainer}>
                <CircleWithText text={"Team\nmanagement"} />
                <Text style={styles.bodyText}>{text.firstParagraph}</Text>
            </View>
            <View style={styles.circleContainer}>
                <Text style={styles.bodyText}>{text.secondParagraph}</Text>
                <CircleWithText text={"Task\nscheduler"}/>
            </View>
            <View style={styles.circleContainer}>
                <CircleWithText text={"Improved\ncommunication"}/>
                <Text style={styles.bodyText}>{text.thirdParagraph}</Text>
            </View>

            <ContinueButton onPress={()=>{navigation.navigate("Login")}} />
        </View>
    );
}
