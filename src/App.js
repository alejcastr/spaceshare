import React, { Component } from 'react';
import './App.css';

import firebase from './firebase.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap'

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      spaceDescription: '',
      username: '',
      items: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.username,
      spaceDescription: this.state.spaceDescription
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: '',
      spaceDescription: ''
    });
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      console.log(items)
      let newState = [];
      for (let item in items) {
        console.log({item})
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
          spaceDescription: items[item].spaceDescription
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className='App'>
        <Navbar className="color-nav" variant="dark">
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
           <Nav className="mr-auto">
           <Nav.Link href="#home">Home</Nav.Link>
           <Nav.Link href="#features">Features</Nav.Link>
           <Nav.Link href="#pricing">Pricing</Nav.Link>
           </Nav>
        </Navbar>
        <div className='container'>
          <section className='add-item'>
            <form autocomplete="off" onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Your Name"
                onChange={this.handleChange}
                value={this.state.username}
              />
              <br />
              <input 
                type="text"
                name="currentItem"
                placeholder="Space"
                onChange={this.handleChange}
                value={this.state.currentItem}
              />
              <br />
              <label for='spaceDescription'>Test</label>
              <textarea
                id='spaceDescription'
                name='spaceDescription'
                cols='30'
                rows='10'
                placeholder="Please enter a description of your space"
                onChange={this.handleChange}
                value={this.state.spaceDescription}
              ></textarea>
              <button>Add Item</button>
            </form>
          </section>
          <section className='display-item'>
              <div className="wrapper">
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <h3>{item.title}</h3>
                        <p>brought by: {item.user}</p>
                        <p>{item.spaceDescription}</p>
                        <p><button onClick={() => this.removeItem(item.id)}>Remove Item</button></p>
                      </li>
                    )
                  })}
                </ul>
              </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;
