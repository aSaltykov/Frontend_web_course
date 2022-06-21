import React, { useState, useEffect } from 'react'
import APIService from '../APIService'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'


function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken, removeToken] = useCookies(['mytoken'])
    const [error, setError] = useState('')


    let navigate = useNavigate()


    const loginBtn = () => {
        APIService.LoginUser({ username, password })
            .then(response => {
                console.log(response)
                if (response.token === undefined) {
                    setError('Invalid data')
                }
                else {
                    setToken('mytoken', response.token)
                    navigate('/main')
                }
            })
            .catch(err => setError('Invalid data'))
    }

    return (
        <div className='container'>
            <div className="row d-flex justify-content-center">
                <div className="col-md-5">
                    <br />
                    <br />
                    <center><h1>Login</h1></center>
                    <br />
                    <br />
                    <div className='mb-3'>
                        <label htmlFor='email' className='form-label'>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="username"
                            name="EmailInput"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='password' className='form-label'>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <small id="passwordHelp" class="text-danger">
                            {error}
                        </small>

                    </div>

                    <div class="row">
                        <div class="col-sm">
                            <button onClick={() => loginBtn()} className='btn btn-secondary'>Sign in</button>
                        </div>
                        <div class="col-sm">
                            Dont have account? <a href="/register">Register</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    )
}

export default Login





