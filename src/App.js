import React, { Component } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <div className="container">
          <Home/>
          <Footer/>
        </div>
      </div>
    );
  }
}

export default App;
