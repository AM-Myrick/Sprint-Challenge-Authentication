import React, { Component } from 'react';
import axios from "axios";
import { withRouter, Route, NavLink, Switch} from "react-router-dom"
import Register from "./Components/Register";
import Login from "./Components/Login";

const URL = process.env.REACT_APP_API_URL;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      jokes: [],
    }
  }

  authenticate = () => {
    const token = localStorage.getItem("secret_bitcoin_token");
    const options = {
      headers: {
        authorization: token
      },
    }
    
    if (token) {
      axios.get(`${URL}/api/jokes`, options)
        .then(res => {
          if(res.status === 200 && res.data) {
            this.setState({ loggedIn: true, jokes: res.data })
          } else {
            this.props.history.push('/signin');
          }
        })
        .catch(err => console.log(err))
    } else {
      this.props.history.push('/signin');
    }
  }
  
  signOut = e => {
    e.preventDefault();
    window.localStorage.removeItem("secret_bitcoin_token");
    this.setState({ loggedIn: false, jokes: [] });
    this.authenticate();
  }

  componentDidMount() {
    this.authenticate();
  }

  componentDidUpdate(prevProps) {
    const {pathname} = this.props.location;
    if (pathname === '/' && pathname !== prevProps.location.pathname) {
      this.authenticate();
    }
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav style={{display: "flex",
               justifyContent: "space-evenly",
               alignItems: "center"}}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
            <NavLink to="/signin">Sign In</NavLink>
            <button className="btn" onClick={this.signOut}>Sign Out</button>
          </nav>
        </header>
        <section>
          <Switch>
            <Route path="/signup" component={Register} />
            <Route path="/signin" component={Login} />
          </Switch>
        </section>
        { this.state.jokes == false ? null:
        <div className="container with-title" style={{width: 1000}}>
          <h2 className="title">Jokes</h2>
            {this.state.jokes.map(joke => 
              <div className="messages" key={joke.id}>
                <div className="message -left">
                  <div className="balloon from-left">
                    <p>{joke.setup}</p>
                  </div>
                </div>
                <div className="message -right" style={{textAlign: "right"}}>
                  <div className="balloon from-right">
                    <p>{joke.punchline}</p>
                  </div>
                </div>
              </div>
            )}
        </div> }
      </div>
    );
  }
}

export default withRouter(App);
