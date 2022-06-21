import React, { useState, useEffect } from 'react'
import APIService from '../APIService'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'


function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [token, setToken] = useCookies(['mytoken'])
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')

    let navigate = useNavigate()
    useEffect(() => {
        if (token['mytoken'] && token['mytoken'] !== 'undefined') {
            APIService.GetUser(token["mytoken"])
                .then(resp => {
                    navigate('/main/')
                })
        }
    }, [token['mytoken']])

    const registerBtn = () => {
        APIService.RegisterUser({
            'email': username,
            "password": password,
            'first_name': firstName,
            'last_name': lastName,
        }, token["mytoken"])
            .then(resp => {
                if (resp['token']) {
                    setToken('mytoken', resp['token'])
                    return
                }
                setEmailError(resp['email'])
                setPasswordError(resp['password'])
                setFirstNameError(resp['first_name'])
                setLastNameError(resp['last_name'])
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className='container'>
            <div className="row d-flex justify-content-center">
                <div className="col-md-5">
                    <br />
                    <br />
                    <center><h1>Registration</h1></center>
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
                        <small id="passwordHelp" class="text-danger">
                            {emailError}
                        </small>
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
                            {passwordError}
                        </small>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='firstName' className='form-label'>First name</label>
                        <input
                            className="form-control"
                            id="firstName"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <small id="passwordHelp" class="text-danger">
                            {firstNameError}
                        </small>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='lastName' className='form-label'>Last name</label>
                        <input
                            className="form-control"
                            id="lastName"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                        <small id="passwordHelp" class="text-danger">
                            {lastNameError}
                        </small>
                    </div>

                    <div class="row">
                        <div class="col-sm">
                            <button className='btn btn-secondary' onClick={registerBtn}>Register</button>
                        </div>
                        <div class="col-sm">
                            Already have account? <a href="/login">Sign in</a>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    )
}

export default Register