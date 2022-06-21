import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import APIService from '../APIService'


function Main() {
    const { id } = useParams()
    const [token, setToken, removeToken] = useCookies(['mytoken'])

    const [lists, setLists] = useState([])

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [taskText, setTaskText] = useState('')
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [listId, setListId] = useState(0)

    const [listText, setListText] = useState('')
    const [isAddingList, setIsAddingList] = useState(false)


    useEffect(() => {
        APIService.GetUser(id, token["mytoken"])
            .then(resp => {
                setFirstName(resp[0]['first_name'])
                setLastName(resp[0]['last_name'])
            })

    }, [])


    useEffect(() => {
        APIService.GetLists(token["mytoken"])
            .then(resp => {
                setLists(resp)
            })
    }, [])

    let navigate = useNavigate()
    const logoutBtn = () => {
        removeToken('mytoken')
        navigate('/login')
    }

    const makeActiveBtn = (task) => {
        APIService.EditTask(task.id, { "text": task.text, "status": "ACTIVE" }, token["mytoken"])
            .then(() => {
                APIService.GetLists(token["mytoken"])
                    .then(resp => {
                        setLists(resp)
                    })
            })
    }


    const makeDoneBtn = (task) => {
        APIService.EditTask(task.id, { "text": task.text, "status": "DONE" }, token["mytoken"])
            .then(() => {
                APIService.GetLists(token["mytoken"])
                    .then(resp => {
                        setLists(resp)
                    })
            })
    }

    const deleteTaskBtn = (task) => {
        APIService.DeleteTask(task.id, token["mytoken"])
        APIService.GetLists(token["mytoken"])
            .then(resp => {
                setLists(resp)
            })
    }

    const deleteListBtn = (list) => {
        APIService.DeleteList(list.id, token["mytoken"])
        window.location.reload()
    }

    const addTaskBtn = (list) => {
        setTaskText('')
        setIsAddingTask(true)
        setListId(list.id)
    }

    const sendTaskBtn = () => {
        APIService.CreateTask({ "list": listId, "text": taskText, "status": "ACTIVE" }, token["mytoken"])
            .then(() => {
                APIService.GetLists(token["mytoken"])
                    .then(resp => {
                        setLists(resp)
                    })
            })

        setIsAddingTask(false)
        setTaskText('')
    }

    const addListBtn = () => {
        setListText('')
        setIsAddingList(true)
    }

    const sendListBtn = () => {
        APIService.CreateList({"title": listText}, token["mytoken"])
            .then(() => {
                APIService.GetLists(token["mytoken"])
                    .then(resp => {
                        setLists(resp)
                    })
            })

        setIsAddingList(false)
        setListText('')
    }

    return (
        <div class="content">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

            <div class="sticky-top">
                <nav class="navbar navbar-default" role="navigation">
                    <div class="container">
                        <a class="nav-item"></a>
                        <a class="btn navbar-btn navbar-right pull-right" role="button" onClick={() => logoutBtn()}>Logout</a>
                    </div>
                </nav>
            </div>
            <div class="container">
                {isAddingTask &&
                    <div className='popup'>
                        <div className='popup-inner'>
                            <div className='mb-3'>
                                <input
                                    className="form-control"
                                    placeholder="Input your task"
                                    value={taskText}
                                    onChange={e => setTaskText(e.target.value)}
                                />
                            </div>
                            <div class="row" >
                                <div class="col-sm">
                                    <center><button className='btn btn-danger' onClick={() => setIsAddingTask(false)}>Cancel</button></center>
                                </div>
                                <div class="col-sm">
                                    <center><button className='btn btn-secondary' onClick={sendTaskBtn}>Save task</button></center>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {isAddingList &&
                    <div className='popup'>
                        <div className='popup-inner'>
                            <div className='mb-3'>
                                <input
                                    className="form-control"
                                    placeholder="Input list title"
                                    value={listText}
                                    onChange={e => setListText(e.target.value)}
                                />
                            </div>
                            <div class="row" >
                                <div class="col-sm">
                                    <center><button className='btn btn-danger' onClick={() => setIsAddingList(false)}>Cancel</button></center>
                                </div>
                                <div class="col-sm">
                                    <center><button className='btn btn-secondary' onClick={sendListBtn}>Save list</button></center>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div class="row">
                    {lists.map(list =>
                        <div class="col-lg-4">
                            <div class="card-box">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-4">
                                            <h4 class="text-dark header-title">{list.title}</h4>
                                        </div>
                                        <div class="col">
                                        </div>
                                        <div class="col">
                                        </div>
                                        <div class="col">
                                            <button type="button" class="btn btn-outline-danger" onClick={() => deleteListBtn(list)}><i class="fa fa-trash-o"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline-secondary" onClick={() => addTaskBtn(list)}>Add task</button>

                                <center><p class="text-muted m-b-30 font-13">Tasks in progress</p></center>
                                <ul class="sortable-list taskList list-unstyled ui-sortable" >
                                    {list.tasks.map(task =>
                                        <div>
                                            {task.status === 'ACTIVE' &&
                                                <li class="task-info ui-sortable-handle">
                                                    {task.text}
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="" onClick={() => makeDoneBtn(task)} />
                                                        <label class="form-check-label">
                                                            <p class="text-muted m-b-30 font-13">Done?</p>
                                                        </label>
                                                    </div>
                                                </li>
                                            }
                                        </div>
                                    )}
                                    <hr />
                                    <center><p class="text-muted m-b-30 font-13">Done tasks</p></center>
                                    {list.tasks.map(task =>
                                        <div>
                                            {task.status === 'DONE' &&
                                                <li class="task-info ui-sortable-handle">
                                                    {task.text}
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" onClick={() => makeActiveBtn(task)} checked />
                                                        <label class="form-check-label" for="flexCheckChecked">
                                                            <p class="text-muted m-b-30 font-13">Done?</p>
                                                        </label>
                                                    </div>
                                                    <button type="button" class="btn btn-outline-danger btn-sm" onClick={() => deleteTaskBtn(task)}><i class="fa fa-trash-o"></i></button>
                                                </li>
                                            }
                                        </div>
                                    )}

                                </ul>
                            </div>
                        </div>
                    )}
                    <div class="col-lg-4">
                        <div class="card-box">
                            <button type="button" class="btn btn-outline-secondary" onClick={addListBtn}>Add new List</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main