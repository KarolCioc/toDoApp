import React from 'react';
import { View, KeyboardAvoidingView, Platform, Pressable, Alert, Text } from 'react-native';
import HeaderForDrawer from './headerForDrawer';
import { TextArea } from 'native-base';
import { Dimensions } from 'react-native';
import { Select, CheckIcon, Image, Checkbox } from "native-base";
import {styles} from './style';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { Calendar } from 'react-native-calendars';
import { Keyboard } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, query, where, getDocs  } from 'firebase/firestore';
const window = Dimensions.get('window');

export default function AddTask({ navigation }) {
const [showCalendar, setShowCalendar] = React.useState(false);
const [showMenu, setShowMenu] = React.useState(false);
const [showPriority, setShowPriority] = React.useState(false);
const [newTaskName, setNewTaskName] = React.useState("");
const [taskDate, setTaskDate] = React.useState("");
const [showPicker, setShowPicker] = React.useState(false);
const [reminderTime, setReminderTime] = React.useState(new Date());
const [priority, setPriority] = React.useState(1);
const [groups, setGroups] = React.useState([]);
const [selectedGroup, setSelectedGroup] = React.useState(null);
const [isTaskForGroup, setIsTaskForGroup] = React.useState(false);

const toggleMenu = () => {
  Keyboard.dismiss();
  setShowMenu(!showMenu);
  console.log("date task ",taskDate);
};
const toggleCalendar = () => {
  Keyboard.dismiss();
  setShowCalendar(!showCalendar); 
};
const togglePriority = () => {
  Keyboard.dismiss();
  setShowPriority(!showPriority); 
};

const scheduleNotification = async (taskName, taskDate) => {
  let reminderDate = new Date(taskDate);
  reminderDate.setHours(reminderTime.getHours(), reminderTime.getMinutes(), 0, 0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Przypomnienie o zadaniu",
      body: taskName,
    },
    trigger: reminderDate,
  });
};

const showDatePicker = () => {
  setShowPicker(true);
};

const onChange = (event, selectedDate) => {
  const currentDate = selectedDate || reminderTime;
  setShowPicker(Platform.OS === 'ios');
  setReminderTime(currentDate);
  setShowMenu(false);
};

const addTask = async ()=>{
  const newTask = {
    name: newTaskName,
    completed: false,
    date: taskDate,
    priority: priority,
  };

  try {
    if (isTaskForGroup && selectedGroup) {
      await addDoc(collection(db, 'groups', selectedGroup, 'tasks'), newTask);
    } else {
      const userAuth = getAuth();
      const userId = userAuth.currentUser ? userAuth.currentUser.uid : null;
      if (userId) {
        await addDoc(collection(db, 'users', userId, 'tasks'), newTask);
      }
      else{
        console.error('No authenticated user found');
        return;
      }
    }

    if (newTaskName.length < 5) {
      Alert.alert("Task name is too short");
      return;
    }
  
    if (!taskDate) {
      Alert.alert("Please select a date for the task");
      return;
    }

    await scheduleNotification(newTaskName, taskDate);
    Alert.alert("Task added and reminder set!");
    navigation.goBack();
    }catch(error){
        console.error('Erorr during post new task',error)
    }
}

React.useEffect(() => {
  const userAuth = getAuth();
  const userId = userAuth.currentUser ? userAuth.currentUser.uid : null;

  if (userId) {
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where(`members.${userId}`, '==', true));

    getDocs(q).then(querySnapshot => {
      const userGroups = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGroups(userGroups);
    }).catch(error => {
      console.error("Error getting groups: ", error);
      Alert.alert("Error getting groups");
    });
  }
}, []);


  return (
    <View style={{ flex: 1 }}>
      <HeaderForDrawer navigation={navigation}/>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#F1F1F1' }}
      >
      { showCalendar ?
      <View>
        <Calendar
        onDayPress={(day)=>
          {setTaskDate(day.dateString);setShowCalendar(!showCalendar);
        }}
        style={{height: window.height*0.55,}}/>
      </View> : null
      }
        <TextArea
          h={window.height * 0.2}
          style={styles.textAreaTask}
          mx="auto"
          placeholder="Enter your new task"
          w="100%"
          onChangeText={(text) => {setNewTaskName(text)}}
        />
        { showMenu ? 
            <View style={styles.dotsMenu}>
              <Pressable style={{flex:1, flexDirection:'row'}} onPress={() => navigation.navigate('Map')}>
                <Text style={{ textAlign: 'left', flex: 1 }}>Localization</Text>
                <Image style={{height:20,width: 20}} alt="pin_icon" source={require('../assets/images/pin.png')}/>
              </Pressable>
              <Pressable style={{flex:1, flexDirection:'row'}} onPress={showDatePicker}>
                <Text style={{ textAlign: 'left', flex: 1 }}>Notification</Text>
                <Image style={{height:20,width: 20}} alt="pin_icon" source={require('../assets/images/clock.png')}/>
              </Pressable>
            </View>
        : null}
        {showPicker ? (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="spinner"
          onChange={onChange}
        />
        ): null}

        { showPriority ? 
            <View style={styles.dotsMenu}>
            <Pressable style={{flex:1, flexDirection:'row'}} onPress={()=> {setPriority(1); setShowPriority(!showPriority)}}>
              <Text style={{ textAlign: 'left', flex: 1 }}>Priority 1</Text>
              <Image style={{height:20,width: 20, resizeMode:'contain'}} alt="pr1_icon" source={require('../assets/images/pr1.png')}/>
            </Pressable>
            <Pressable style={{flex:1, flexDirection:'row'}} onPress={()=> {setPriority(2); setShowPriority(!showPriority)}}>
              <Text style={{ textAlign: 'left', flex: 1 }}>Priority 2</Text>
              <Image style={{height:20,width: 20,resizeMode:'contain'}} alt="pr2_icon" source={require('../assets/images/pr2.png')}/>
            </Pressable>
            <Pressable style={{flex:1, flexDirection:'row'}} onPress={()=> {setPriority(3); setShowPriority(!showPriority)}}>
              <Text style={{ textAlign: 'left', flex: 1 }}>Priority 3</Text>
              <Image style={{height:20,width: 20, resizeMode:'contain'}} alt="pr3_icon" source={require('../assets/images/pr3.png')}/>
            </Pressable>
          </View>
        : null}
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:window.width*1,backgroundColor:'white'}}>
          <Pressable onPress={toggleCalendar}>
            <Image alt="calendar_img" source={require('../assets/images/calendar.png')}/>
          </Pressable>
          <Pressable onPress={togglePriority}>
            <Image alt="priority_img" source={require('../assets/images/priority_menu.png')}/>
          </Pressable>
          <Pressable onPress={toggleMenu}>
            <Image alt="dots_img" source={require('../assets/images/dots_menu.png')}/>
          </Pressable>
        </View>
        <View style={styles.wrapperSelectAndImg}>
        {isTaskForGroup ? (
          <Select
            selectedValue={selectedGroup}
            minWidth="200"
            width={window.width*0.75}
            accessibilityLabel="Choose Group"
            placeholder="Choose Group"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon style={{backgroundColor:'white'}} size="5" />
            }} 
            mt={1}
            onValueChange={itemValue => setSelectedGroup(itemValue)}
          >
            {groups.map(group => (
              <Select.Item key={group.id} label={group.name} value={group.id} />
            ))}
          </Select>
          ):
          <Checkbox
            isChecked={isTaskForGroup}
            onChange={() => {
              console.log('Checkbox is changed');
              setIsTaskForGroup(!isTaskForGroup);
            }}
            value="isTaskForGroup"
          ><Text>Is this task for a group?</Text>
          </Checkbox>}
            <Pressable onPress={addTask}>
                <Image alt="arrow-img" style={styles.arrowImg} source={require('../assets/images/arrow_top.png')}/>
            </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}