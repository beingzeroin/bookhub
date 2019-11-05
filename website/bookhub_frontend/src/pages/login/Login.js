import React, { Component } from 'react';
import './login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link,Redirect} from 'react-router-dom';

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
        login: false,
        pass: '',
        validate: false,
        dbuser: [],
        user:{
            email: '',
            password: ''
        }   
     }
  } 

  render(){
    const {user} = this.state;
    if (this.state.validate) {
      return <Redirect push to="/main" />;
    }

    return (
      <div>
        <div className = "logo rounded mx-auto d-block">
            <img width="200" height="200" src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/San_Jose_State_Spartans_logo.svg/378px-San_Jose_State_Spartans_logo.svg.png"
            alt = "SJSU SAMMY"/>
        <p className="h3 mb-3 text-center font-weight-bold">SJSU Bookhub</p>
          <h1 className="text-center h4 mb-3 font-weight-normal">Sign In</h1>
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="email" id="inputEmail" className="form-control"  onChange={e =>this.setState({user:{...user,email: e.target.value}})}  placeholder="Email address" required autoFocus></input>
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" id="inputPassword" className="form-control" onChange={e =>this.setState({user:{...user,password: e.target.value}})} placeholder="Password" required></input>
          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"/> Remember me
            </label>
          </div>
          <button className="btn btn-lg btn-primary btn-block" onClick={this.logIn} type="submit">Sign in</button>
          <div className="mb-3">
            Need an account? &nbsp;
            <Link to="/signup">
               Sign up
            </Link>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; SJSU 2019</p>
        </div>
      </div>
    );
  }

  
renderdb= (e) => {
  if(e.email === this.state.user.email){
   return(e.password);
  }
}

 getP(){
   const {login,user,dbuser} = this.state;
   console.log(this.state.user.email);
   console.log(this.state.user.password);
    return fetch(`http://localhost:4000/login?email=${user.email}`)
    .then(res => res.json())
    .then(res => this.setState({dbuser: res.data}))
    .catch(err => console.error(err));
}

logIn =  _ => {
  const {login, user, dbuser} = this.state;
  this.getP();
  console.log(dbuser);
  console.log(dbuser.map(this.renderdb));
  if(dbuser.map(this.renderdb) === this.state.user.password){
    this.setState({validate: true});
  }
}
}

export default Login;