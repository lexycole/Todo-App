  import React from 'react';
  import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    TextInput,
  } from 'react-native';


  // todoIndex variable
  let todoIndex = 0;

  export default class App extends React.Component {
    // constructor function
    constructor() {
      super()
      this.state = {
        inputValue: '',
        todos: [],
        type: 'ALL'
      }
      // bINDS the method to class in the constructor. Because you're using classes, functions won't be auto-bound to the class.
      this.submitTodo = this.submitTodo.bind(this);
      // Binds the ToggleComplete method to the class in the constructor
      this.toggleComplete = this.toggleComplete.bind(this);
      // Binds the deleteTodo method to the class in the constructor
      this.deleteTodo = this.deleteTodo.bind(this);
      // Set state type variable to 'ALL' 
      this.setType = this.setType.bind(this)
    }

      //Input Change method, whichn takes inputValue as an argument.
        inputChange(inputValue) {
        // Logs out the inputValue value to make sure the method is working
        console.log(' Input Value:  ', inputValue)
        // sETS the satet with the new value- same as this.setState({inputValue: inputValue})
        this.setState({ inputValue })
        };
      // Adding the submitTodo function.
        submitTodo () {
      // Checks whether inputValue is empty or only contains whitespace. if it's empty returns without doing anything else
        if (this.state.inputValue.match(/^\s*$/)) {
          return
        }
      //If inputValue isn't empty, creates and assigns a todo variable an object with title, a todoIndex, and a complete Boolean(you'll create the todoIndex shortly)
        const todo = {
          title: this.state.inputValue, 
          todoIndex, 
          complete: false
        }
        todoIndex++ //Increments the todoIndex
        //Pushes the new todo to the existing array of todos
        const todos = [...this.state.todos, todo]
        //Sets the state of the todos to match the updated array of this.state.todos, and resets inputValue to an empty string. 
        this.setState({ todos, inputValue: '' }, () => {
          console.log('State: ', this.state)
        })
      };
      // deleteTodo takes the todoIndex as an argument, filters todos to return all but the todo with the index that was passed in, and then resets the state to remaining todos.
      deleteTodo (todoIndex) {
        let { todos } = this.state;
        todos = todos.filter((todo) => todo.todoIndex !== todoIndex)
        this.setState({ todos })
      };
      // toggleComplete also takes the todoIndex as an argument, and loops through the todos until it finds the todo with the given index. It changes the complete Boolean to the oppsite of complete's current setting, and then resets the state of the todos.
      toggleComplete (todoIndex) {
       let todos = this.state.todos;
      todos.forEach((todo) => {
        if (todo.todoIndex === todoIndex) {
          todo.complete = !todo.complete
        } 
      })
      this.setState({ todos })
     }
      // Adding the setType function
      setType (type) {
        this.setState({ type })
      }
    
      // Output Rendering 
      render() {
        const { todos, inputValue, type } = this.state
          return (
            <View style={styles.container}>
              <ScrollView keyboardShouldPersistTaps='always' style={ styles.content }> 
                  <Heading />
                  <Input 
                  // Passes inputValue as a property to the Input component
                    inputValue={ inputValue }
                    // Passes inputChange as a property to the Input component
                    inputChange={(text) => this.inputChange(text)} />
                  <TodoList type={type} toggleComplete={this.toggleComplete} deleteTodo={this.deleteTodo} todos={todos} />
                  <Button submitTodo={this.submitTodo} />
                </ScrollView>
                <TabBar type={type} setType={this.setType} />
            </View>
          );
        }
      }
  
      // Creating Heading Component
      const Heading = () => (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            My Todos
          </Text>
        </View>
      );
      // Creating the TextInput component
      const Input = ({ inputValue, inputChange }) => (
        <View style={styles.inputContainer}>
        <TextInput 
            value={inputValue}
            style={styles.input}
            placeholder='What needs to be done?'
            placeholderTextColor='#CACACA'
            selectionColor='#666666'
            onChangeText={inputChange} />
        </View>
      );
      // Creating the Button component
      const Button = ({ submitTodo }) => (
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            underlayColor='#efefef'
            style={styles.button}
            onPress={submitTodo}>
              <Text style={styles.submit}>
                Submit
              </Text>
            </TouchableHighlight>
        </View>
      );
      // Creating the Todo component
      const Todo = ({ todo, toggleComplete, deleteTodo }) => (
        <View style={styles.todoContainer}>
          <Text style={styles.todoText}>
            {todo.title}
          </Text>
          <View style={styles.buttons}>
            <TodoButton name='Done' complete={ todo.complete} onPress={() => toggleComplete(todo.todoIndex)} />
            <TodoButton name='Delete' onPress={ () => deleteTodo(todo.todoIndex)} />
          </View>   
        </View>
        );
      // Creating TodoList component
      const TodoList = ({ todos, deleteTodo, toggleComplete, type }) => {
        // Add filter to return only the todos ot the type you currently want bank, based on the tab that's selected
        const getVisibleTodos = (todos, type) => {
          switch (type) {
            case 'ALL':
              return todos
            case 'Complete':
              return todos.filter((t) => t.complete)
            case 'Active':
              return todos.filter((t) => !t.complete)
          }
        }
        todos = getVisibleTodos(todos, type);
        todos = todos.map((todo, i) => {
              return (
              <Todo deleteTodo={deleteTodo} toggleComplete={toggleComplete} key={i} todo={todo} />) 
              })
              return ( <View>{todos}</View> );
        };
      // Take onPress, complete, and name as props
      const TodoButton = ({ onPress, complete, name }) => (
        <TouchableHighlight onPress={onPress} underlayColor= '#efefef' style={styles.todoButton}>
        {/* Checks whether complete is true, and applies a style also Checks whether the name property equals "Delete" AND, if so, applies a style */}
          <Text style={[ styles.todoButtonText, complete ? styles.todoButtonComplete : null, name === 'Delete' ? styles.deleteButton : null ]}>{name}</Text>
        </TouchableHighlight>
    );
    // Creating TabBar component for setType
    const TabBar = ({ setType, type }) => (
      <View style ={styles.tabBarContainer}>
      <TabBarItem type={type} title='ALL' setType={() => setType('ALL')} />
      <TabBarItem type={type} border title='Active' setType={() => setType('Active')} />
      <TabBarItem type={type} border title='Complete' setType={() => setType('Complete')} />
      </View>
    );
    // Creating the TabBarItem Component
    const TabBarItem = ({ border, title, selected, setType, type }) => (
      <TouchableHighlight 
          underlayColor='efefef' 
          onPress={setType} 
          style={[ styles.item, selected ? styles.selected : null, 
                          border ? styles.border : null,
                          type === title ? styles.selected : null ]} >
                          <Text style={[ styles.itemText, type === title ? styles.bold : null ]}> {title} </Text> 
      </TouchableHighlight>
    );

      // ALL Component Styles
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'rgba(17, 24, 39, 1)',
          alignItems: 'center',
          justifyContent: 'center'
        },
        content: {
          flex: 1,
          paddingTop: 60
        },
        header: {
          marginTop: 80
        },
        headerText: {
          textAlign: 'center',
          fontSize: 32,
          fontWeight: '500',
          color: 'rgba(34,211,238,1)',
        },
        inputContainer: {
          paddingTop: 10,
          marginLeft: 20,
          marginRight: 20,
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowColor: '#000000',
          shadowOffset: { width: 2, height: 2 }
          },
        input: {
          width: 380,
          height: 50,
          backgroundColor: '#ffffff',
          paddingLeft: 20,
          paddingRight: 10,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10
          },
        buttonContainer: {
          alignItems: 'flex-end'
        },
        button: {
          height: 50,
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: '#4f46e5',
          width: 200,
          marginRight: 20,
          marginTop: 15,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, .1)',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10
        },
        todoContainer: {
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          borderColor: '#ededed',
          paddingLeft: 14,
          paddingTop: 7,
          paddingBottom: 7,
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowColor: '#000000',
          shadowOffset: { width: 2, height: 2 },
          flexDirection: 'row',
          alignItems: 'center'
          },
          todoText: {
            fontSize: 17
          },
        submit: {
          color: '#fff',
          fontWeight: '600'
        },
        buttons: {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center' 
        },
        todoButton: {
          alignSelf: 'flex-end',
          padding: 7,
          borderColor: '#ededed',
          borderWidth: 1,
          borderRadius: 4,
          marginRight: 5
        },
        todoButtonText: {
          color: '#666666'
        },
        todoButtonComplete: {
          color: 'green',
          fontWeight: 'bold'
        },
        deleteButton: {
          color: 'rgba(175, 47, 47, 1)'
        },
        tabBarContainer: {
          height: 70,
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: '#dddddd'
        },
        item: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        },
        border: {
          borderLeftWidth: 1,
          borderLeftColor: '#dddddd'
        },
        itemText: {
          color: '#777777',
          fontSize: 16
        },
        selected: {
          backgroundColor: '#ffffff'
        },
        bold: {
          fontWeight: 'bold'
        } 
      });