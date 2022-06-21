export default class APIService {
    static CreateTask(body, token) {
        return fetch('http://127.0.0.1:8000/task-create/',
            {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Token ${token}`
                },
                body: JSON.stringify(body)
            }).then(resp => resp.json())

    }

    static EditTask(id, body, token) {
        return fetch(`http://127.0.0.1:8000/task-change/${id}/`,
            {
                'method': 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Token ${token}`
                },
                body: JSON.stringify(body)
            }).then(resp => resp.json())

    }

    static DeleteTask(id, token) {
        return fetch(`http://127.0.0.1:8000/task-change/${id}/`,
            {
                'method': 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Token ${token}`
                },
            }).then(resp => resp.json())

    }

    static CreateList(body, token) {
        return fetch('http://127.0.0.1:8000/list/',
            {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Token ${token}`
                },
                body: JSON.stringify(body)
            }).then(resp => resp.json())

    }

    static GetLists(token) {
        return fetch(`http://127.0.0.1:8000/list/`,
            {
                'method': 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Token ${token}`
                },
            }).then(resp => resp.json())

    }

    static DeleteList(id, token) {
        return fetch(`http://127.0.0.1:8000/list-delete/${id}/`,
            {
                'method': 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Token ${token}`
                },
            }).then(resp => resp.json())

    }

    static GetUser(token) {
        return fetch(`http://127.0.0.1:8000/my-profile/`,
            {
                'method': 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Token ${token}`
                },
            }).then(resp => resp.json())

    }


    static LoginUser(body) {
        return fetch('http://127.0.0.1:8000/auth/',
            {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(resp => resp.json())

    }


    static RegisterUser(body) {
        return fetch('http://127.0.0.1:8000/user/',
            {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(resp => resp.json())

    }
}
