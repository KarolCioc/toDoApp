import { StyleSheet, Text, View, Image, Pressable, TextInput, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { RadioButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
const window = Dimensions.get("window");

export default function MainList({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [taskDate, setTaskDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [editableTask, setEditableTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const userAuth = getAuth();
  const loggedInUserId = userAuth.currentUser ? userAuth.currentUser.uid : null;

  useEffect(() => {
    getData()
  }, [taskDate]);

  const handleEdit = (task) => {
    setEditableTask({ ...task });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editableTask) {
      try {
        const taskRef = doc(db, 'users', loggedInUserId, 'tasks', editableTask.id);
        await updateDoc(taskRef, {
          name: editableTask.name,
          priority: editableTask.priority,
        });

        setTasks(prevTasks => {
          return prevTasks.map(task => {
            if (task.id === editableTask.id) {
              return { ...task, ...editableTask };
            } else {
              return task;
            }
          });
        });
      setIsEditing(false);
      setEditableTask(null);
      } catch (error) {
        console.error('Error while saving task', error);
      }
    }
};
  
  const getData = async () => {
    if (!loggedInUserId) {
      console.error("No logged in user id found");
      return;
    }
    const q = query(collection(db, 'users', loggedInUserId, 'tasks'), where('date', '==', taskDate));
    try {
      const querySnapshot = await getDocs(q);
      const filteredTasks = [];
      querySnapshot.forEach((doc) => {
        filteredTasks.push({ id: doc.id, ...doc.data() });
      });
      filteredTasks.sort((a, b) => a.priority - b.priority);
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error while getting tasks", error);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [taskDate,editableTask, tasks])
  );

  const handleDelete = async (taskId) => {
    try {
      const taskRef = doc(db, 'users', loggedInUserId, 'tasks', taskId);
      await deleteDoc(taskRef);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error while deleting task', error);
    }
  };
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

  return (
    <View style={styles.container}>
      <Pressable onPress={()=> setShowCalendar(!showCalendar)}>
        <Text style={{textAlign:'center',fontSize: 14, margin:5}}>{taskDate}</Text>
      </Pressable>
      {isEditing && (
      <View style={styles.editModal}>
        <Text style={styles.label}>Nazwa zadania:</Text>
        <TextInput
          value={editableTask.name}
          onChangeText={(text) => {
            setEditableTask((prevEditableTask) => ({
              ...prevEditableTask,
              name: text,
            }));
          }}
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
          <Pressable style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => setIsEditing(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    )}

      { showCalendar ?
      <View>
        <Calendar
        onDayPress={(day)=>
          {setTaskDate(day.dateString);setShowCalendar(!showCalendar);
        }}
        style={{height: window.height*0.55,}}/>
      </View> : null
      }
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noTasks}>Brak zadań w tym dniu</Text>
      )}
      <Pressable style={styles.addCircle} onPress={()=> navigation.navigate("AddTask")}>
        <Image style={styles.imgAdd} source={require('../assets/images/circle_add.png')}/>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    padding: 10
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
  noTasks: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#666666',
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
});