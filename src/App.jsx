import React from 'react';
import Timer from './components/Timer';
import TodoItem from './components/TodoItem';
import TodoInput from './components/TodoInput';
import ClearButton from './components/ClearButton';
import EmptyState from './components/EmptyState';

import './styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.clearCompletedItems = this.clearCompletedItems.bind(this);
    this.startSession = this.startSession.bind(this);
    this.increaseSessionsCompleted = this.increaseSessionsCompleted.bind(this);
    this.toggleItemIsCompleted = this.toggleItemIsCompleted.bind(this);

    this.state = {
      items: [],
      nextItemId: 0,
      sessionIsRunning: false,
      itemIdRunning: null
    };
  }

  addItem(description) {
    const { nextItemId } = this.state;
    const newItem = {
      id: nextItemId,
      description,
      sessionsCompleted: 0,
      isCompleted: false
    };
    this.setState((prevState => ({
      items: prevState.items.concat(newItem),
      nextItemId: prevState.nextItemId + 1
    })));
  }

  clearCompletedItems() {
    let uncompleted = this.state.items.filter(item => !item.isCompleted);
    this.setState({items: uncompleted});
  }

  increaseSessionsCompleted(itemId) {
    let updatedItems = [...this.state.items];
    for (let i=0; i< updatedItems.length; i++) {
      if (updatedItems[i].id === itemId) {
        updatedItems[i].sessionsCompleted += 1;
      }
    }
    this.setState({items: updatedItems})
  }

  toggleItemIsCompleted(itemId) {
    let anyCompleted = false;
    let updatedItems = [...this.state.items];
    for (let i=0; i< updatedItems.length; i++) {
      if (updatedItems[i].id === itemId) {
        updatedItems[i].isCompleted = !updatedItems[i].isCompleted;
      }
      if (updatedItems[i].isCompleted) anyCompleted = true;
    }
    this.setState({items: updatedItems});
    this.setState({areItemsMarkedAsCompleted: anyCompleted});
  }

  startSession(id) {
    this.setState({sessionIsRunning: true, itemIdRunning: id})
  }

  render() {
    const {
      items,
      sessionIsRunning,
      itemIdRunning,
      areItemsMarkedAsCompleted,
    } = this.state;
    return (
      <div className="flex-wrapper">
        <div className="container">
          <header>
            <h1 className="heading">Today</h1>
            {areItemsMarkedAsCompleted ? <ClearButton onClick={this.clearCompletedItems} /> : null}
          </header>

          {sessionIsRunning && items.length !== 0 ?
            <Timer
              mode="WORK"
              onSessionComplete={() => this.increaseSessionsCompleted(itemIdRunning)}
              autoPlays
              key={itemIdRunning}/> : null
          }

          {items.length === 0 ? <EmptyState/> : (

            <div className="items-container">
              {this.state.items.map(item =>
                <TodoItem description = {item.description}
                  sessionsCompleted = {item.sessionsCompleted}
                  isCompleted = {item.isCompleted}
                  startSession = {() => this.startSession(item.id)}
                  toggleIsCompleted = {() => this.toggleItemIsCompleted(item.id)}
                  key = {item.id} />
              )}
            </div>
          )}

        </div>
        <footer>
          <TodoInput addItem={this.addItem} />
        </footer>
      </div>
    );
  }
}

export default App;
