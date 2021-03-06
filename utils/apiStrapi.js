const URL = 'http://localhost:1337';

export const getMe = async (token) => {
    return await fetch(URL + "/users/me", {
        headers: {
          'Authorization': 'Bearer '+ token
        },
      }).catch().then(res => {
            return res.json();
        })
}

export const getGuest = async (user_id) => {
    return await fetch(URL + "/guests/" + user_id, {
      }).then(res => {
            return res.json();
        }).catch()
}

export const getUser = async (user_id, userToken) => {
    return await fetch(URL + "/users/" + user_id, {
        headers: {
          'Authorization': 'Bearer '+ userToken
        },
      }).then(res => {
            return res.json();
        }).catch()
}

export const createGuest = async (data = {}) => {
    const response = await fetch(URL + "/guests", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch();
      return response.json();
}

export const searchQueue = async (user_id) => {
    return await fetch(URL + "/queues?_where[0][created_at_gte]=120&_sort=created_at:ASC&user_id_ne="+user_id).then(res => {
            return res.json();
        }).catch()
}

export const createQueue = async (data = {}) => {
    const response = await fetch(URL + "/queues", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch();
      return response.json();
}

export const createInvite = async (data = {}) => {
  const response = await fetch(URL + "/invites", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch();
    return response.json();
}

export const findInvite = async (invite) => {
  return await fetch(URL + "/invites?_where[0][created_at_gte]=600&_sort=created_at:ASC&link_eq="+invite).then(res => {
          return res.json();
      }).catch()
}

export const searchGame = async (game_id) => {
    return await fetch(URL + "/games/" + game_id).then(res => {
            return res.json();
        }).catch()
}

export const updateGame = async (id, data = {}) => {
    const response = await fetch(URL + "/games/" + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch();
      return response.json();
}
