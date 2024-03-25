import React, { useState, useEffect } from 'react';
import {
  Text, View, FlatList, Modal, TouchableOpacity,
  SafeAreaView, StyleSheet, Alert, Dimensions, TextInput, Pressable, Image
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../firebase';
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc  } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
const window = Dimensions.get("window");

export default function GroupTasks({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userAuth = getAuth();
  const userId = userAuth.currentUser ? userAuth.currentUser.uid : null;
  const [editableTask, setEditableTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [taskDate, setTaskDate] = React.useState(new Date().toISOString().split('T')[0]);


  useEffect(() => {

    getData();
  }, [selectedGroup, taskDate]);

  const handleEdit = (task) => {
    setEditableTask({ ...task });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editableTask) {
      try {
        const taskRef = doc(db, 'groups', selectedGroup, 'tasks', editableTask.id);
        await updateDoc(taskRef, {
          name: editableTask.name,
          priority: editableTask.priority,
        });
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === editableTask.id ? { ...task, ...editableTask } : task))
        );
        setIsEditing(false);
        setEditableTask(null);
      } catch (error) {
        console.error('Error while saving task', error);
        Alert.alert("Error updating task");
      }
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const taskRef = doc(db, 'groups', selectedGroup, 'tasks', taskId);
      await deleteDoc(taskRef);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error while deleting task', error);
      Alert.alert("Error deleting task");
    }
  };

  
  useEffect(() => {
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
  }, [userId, groups]);

  const getData = async()=>{
    if (selectedGroup) {
        const q = query(collection(db, 'groups', selectedGroup, 'tasks'),where('date', '==', taskDate));
        try{
        const querySnapshot = await getDocs(q);
        const groupTasks = [];
        querySnapshot.forEach((doc) => {
          groupTasks.push({id: doc.id, ...doc.data()});
        });
        groupTasks.sort((a, b) => a.priority - b.priority);
        setTasks(groupTasks);
    }catch(error){
        console.error("Error while getting tasks for group")
    }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [taskDate,editableTask, tasks])
  );

  const selectGroup = (groupId) => {
    setSelectedGroup(groupId);
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => selectGroup(item.id)}>
        <Image
            source={{ uri: item.photoUri}}
            style={{ width: 30, height: 30, borderRadius: 25}}
        />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
    <Text style={styles.taskTitle}>{item.name}</Text>
    <View style={styles.actionsContainer}>
        <RadioButton
        value="checked"
        status={'unchecked'}
        onPress={() => handleDelete(item.id)}
        />
        <TouchableOpacity onPress={() => handleEdit(item)}>
        <Icon name="edit" size={18} color="#000" />
        </TouchableOpacity>
    </View>
    </View>
  );

  const renderEditUI = () => (
    <View style={styles.editModal}>
    <Text style={styles.label}>Nazwa zadania:</Text>
      <TextInput
        value={editableTask?.name}
        onChangeText={(text) => setEditableTask(prev => ({ ...prev, name: text }))}
        style={styles.input}
      />
      <Text style={styles.label}>Priorytet (1 najwyższy, 3 najniższy):</Text>
        <TextInput
          value={editableTask.priority.toString()}
          keyboardType="numeric"
          onChangeText={(text) => {
            const priorityValue = text.trim() === '' ? '' : parseInt(text, 10);
            setEditableTask((prevEditableTask) => ({
              ...prevEditableTask,
              priority: !isNaN(priorityValue) ? priorityValue : prevEditableTask.priority,
            }));
          }}
          style={styles.input}
        />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setIsEditing(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setIsModalVisible(true)}>
        <Icon name="users" size={18} color="#000" />
        <Text style={styles.menuText}>Choose group</Text>
      </TouchableOpacity>
      <Pressable onPress={()=> setShowCalendar(!showCalendar)}>
        <Text style={{textAlign:'center',fontSize: 14, margin:5}}>{taskDate}</Text>
      </Pressable>
    {tasks.length  > 0 ? (
    <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
    />) : (
        <Text style={styles.noTasks}>Brak zadan w tym dniu</Text>
    )}
      

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={groups}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </Modal>

      { showCalendar ?
      <View>
        <Calendar
        onDayPress={(day)=>
          {setTaskDate(day.dateString);setShowCalendar(!showCalendar);
        }}
        style={{height: window.height*0.66,}}/>
      </View> : null
      }

      {isEditing && renderEditUI()}

      <Pressable style={styles.addCircle} onPress={()=> navigation.navigate("AddTask")}>
        <Image style={styles.imgAdd} source={require('../assets/images/circle_add.png')}/>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0 
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  noTasks: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#666666',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 10,
  },
  modalView: {
    marginTop: 80,
    marginBottom:80,
    marginLeft:20,
    marginRight:20,
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
    justifyContent: 'center'
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 16,
    flexShrink: 1,
    maxWidth: window.width*0.8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    width: window.width*0.5,
    height: window.height*0.06,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 0.5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  editModal: {
    position: 'absolute', 
    top: '20%', 
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: '#CDD016',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
    minWidth: 64,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  label: {
    fontSize: 11,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  addCircle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imgAdd: {
    height: 70,
    width: 70,
    resizeMode: 'contain',
  },
});
