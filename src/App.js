import React, { Component } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom'

////////////////////////////////////////////////////////////
// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time

class App extends Component {
  render = () => (
    <Router>
      <div>
        <AuthButton/>
        <ul>
          <li>
            <Link to='/public'>Public Page</Link>
          </li>
          <li>
            <Link to='/protected'>Protected Page</Link>
          </li>
        </ul>

        <Route path='/public' component={Public}/>
        <Route path='/login' component={Login}/>
        <PrivateRoute path='/protected' component={Protected}/>
      </div>
    </Router>
  )
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate (cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signOut (cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const AuthButton = withRouter(
  ({history}) =>
    fakeAuth.isAuthenticated ? (
      <p>
        Welcome!{' '}
        <button
          onClick={() => {
            fakeAuth.signOut(() => history.push('/'))
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
)

const PrivateRoute = ({component: Component, ...rest}) =>
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: {from: props.location}
          }}
        />
      )
    }
  />

const Public = () =>
  <h3>Public</h3>

const Protected = () =>
  <h3>Protected</h3>

class Login extends Component {
  state = {redirectToReferrer: false}

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({redirectToReferrer: true})
    })
  }

  render () {
    let {from} = this.props.location.state || {from: {pathname: '/'}}
    let {redirectToReferrer} = this.state
    if (redirectToReferrer) return <Redirect to={from}/>

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )

  }
}

export default App

