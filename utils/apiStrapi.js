const URL = 'https://chess-api.0x539.co';
// const URL = 'http://localhost:1337';

export const getMe = async (token) => {
    return await fetch(URL + "/users/me", {
        headers: {
          'Authorization': 'Bearer '+ token
        },
      }).then(res => {
            return res.json();
        })
}

export const getGuest = async (user_id) => {
    return await fetch(URL + "/guests/" + user_id, {
      }).then(res => {
            return res.json();
        })
}

export const getUser = async (user_id, userToken) => {
    return await fetch(URL + "/users/" + user_id, {
        headers: {
          'Authorization': 'Bearer '+ userToken
        },
      }).then(res => {
            return res.json();
        })
}

export const createGuest = async (data = {}) => {
    const response = await fetch(URL + "/guests", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response.json();
}

export const searchQueue = async (user_id, token , isUser) => {
    let data = {}

    if (isUser) {
      data.headers = {
        'Authorization': 'Bearer '+ token
      }
    }

    return await fetch(URL + "/queues?_where[0][created_at_gte]=120&_sort=created_at:ASC&user_id_ne="+user_id, data).then(res => {
            return res.json();
        })
}

export const createQueue = async (d = {}, token , isUser) => {
    let data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(d)
    }

  if (isUser) {
    data.headers = {
      'Authorization': 'Bearer '+ token
    }
  }
    const response = await fetch(URL + "/queues", data);
      return response.json();
}

export const createInvite = async (d = {}, token , isUser) => {
    let data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(d)
    }

  if (isUser) {
    data.headers = {
      'Authorization': 'Bearer '+ token
    }
  }
  const response = await fetch(URL + "/invites", data);
    return response.json();
}

export const findInvite = async (invite, token , isUser) => {
  let data = {}

  if (isUser) {
    data.headers = {
      'Authorization': 'Bearer '+ token
    }
  }
  return await fetch(URL + "/invites?_where[0][created_at_gte]=600&_sort=created_at:ASC&link_eq="+invite, data).then(res => {
          return res.json();
      })
}

export const searchGame = async (game_id, token , isUser) => {
    let data = {}

    if (isUser) {
      data.headers = {
        'Authorization': 'Bearer '+ token
      }
    }
    return await fetch(URL + "/games/" + game_id, data).then(res => {
            return res.json();
        })
}

export const updateGame = async (id, d = {}, token , isUser) => {
    let data = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(d)
    }

  if (isUser) {
    data.headers = {
      'Authorization': 'Bearer '+ token
    }
  }
  const response = await fetch(URL + "/games/" + id, data);
    return response.json();
}


// Login

export const login = async (identifier, password) => {
    const response = await fetch(URL + "/auth/local", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({identifier, password})
    });
    return response.json();
}

// signUp

export const signUp = async (username, email, password) => {
  const response = await fetch(URL + "/auth/local", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, email, password})
  });
  return response.json();
}