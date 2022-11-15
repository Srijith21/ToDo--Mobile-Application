import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Delete from './src/assets/Images/delete.svg';
import Completed from './src/assets/Images/tick.svg';
import UndoImage from './src/assets/Images/revert.svg';

import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function App() {
  const [inputText, SetInputText] = useState('');
  const [todos, SetTodos] = useState([]);

  const fetchTasks = () => {
    axios
      .get('https://todo.talrop.works/')
      .then(response => SetTodos(response.data))
      .catch(error => console.log(error));
  };
  useEffect(() => {
    fetchTasks();
  }, []);
 
  const addToList = () => {
    axios
      .post('https://todo.talrop.works/create/', {
        title: inputText,
      })
      .then(response => { console.log(response.data);
        SetInputText('');
        fetchTasks();
      })
      .catch(error => console.log(error));
  };

  const removeItem = todo => {
    axios
      .post(`https://todo.talrop.works/delete/${todo.id}/`, {
        is_deleted: true,
      })
      .then(response => {
        console.log(response.data);
        fetchTasks();
      })
      .catch(error => console.log(error));
  };

  const handleStatus = todo => {
    axios
      .post(`https://todo.talrop.works/update/${todo.id}/`, {
        is_completed: !todo.is_completed,
      })
      .then(response => {
        console.log(response.data);
        fetchTasks();
      })
      .catch(error => console.log(error));
  };

  const TodoItem = ({todo}) => (
    <View style={styles.itemView}>
      {todo.is_completed ? (
        <View style={styles.itemLeft}>
          <Completed />
          <Text style={styles.itemTitle}>{todo.title}</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => handleStatus(todo)}
          style={styles.itemLeft}>
          <View style={styles.circleView} />
          <Text style={styles.itemTitle}>{todo.title}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.rightBox}>
        {todo.is_completed &&
          <TouchableOpacity onPress={() => handleStatus(todo)}>
            <UndoImage style={styles.undoimage} />
          </TouchableOpacity>
        }
        <TouchableOpacity onPress={()=> removeItem(todo)}>
          <Delete style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.containerView}>
        <Text style={styles.title}>My ToDo</Text>
        <View style={styles.sectionView}>
          <Text style={styles.sectionTitle}>ToDo List</Text>
          {todos
            .filter(item => !item.is_completed)
            .map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          <View style={styles.addView}>
            <View style={styles.addLeft}>
              <Text style={[styles.typeText, {marginRight: 10}]}>+</Text>
              <TextInput
                value={inputText}
                onChangeText={SetInputText}
                style={styles.typeText}
                placeholder="Type new todo"
              />
            </View>
            <TouchableOpacity onPress={addToList} style={styles.addButton}>
              <Text style={styles.addText}>Add New</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sectionView}>
          <Text style={styles.sectionTitle}>Completed List</Text>
          {todos
            .filter(item => item.is_completed)
            .map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  containerView: {
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 15,
    color: '#000',
  },
  sectionView: {
    paddingVertical: 30,
  },
  circleView: {
    height: 22,
    width: 22,
    borderRadius: 22 / 2,
    borderColor: '#2d2d2d',
    borderWidth: 2,
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
  addView: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addLeft: {
    flexDirection: 'row',
    height: 45,
    paddingHorizontal: 15,
    borderColor: '#999',
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    // borderRightColor: 'transparent',
  },
  typeText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#999',
  },
  addButton: {
    backgroundColor: '#2196f3',
    height: '100%',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  addText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 17,
  },
  rightBox: {
    flexDirection: 'row',
  },
  undoimage: {
    height: 22,
    width: 22,
    marginRight: 20,
  },
});
