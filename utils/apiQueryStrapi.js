
import { gql, useQuery, useMutation } from '@apollo/client';


// Create
export const _createGame = gql`
mutation {
    createGame {
        user {
        id
        created_at
        }
    }
    }
`



export const  _createUser = gql`
mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(input: { data: { username: $username, email: $email, password: $password } }) {
        user {
        id
        created_at
        username
        email
        }
    }
    }
`


export const _createGuest = gql`
mutation {
    createGuest {
        guest {
        created_at
        id
        }
    }
    }
`

export const _createQueue = gql`
mutation {
    createQueue {
        queue {
        created_at
        id
        }
    }
    }
`

export const _createInvite = gql`
mutation {
    createInvite {
        invite {
        created_at
        id
        }
    }
    }
`


export const _createMove = gql`
mutation createMove($game_id: ID!) {
    createMove(input: { data: { game_id: $game_id } }) {
        move {
            id
            created_at
        }
    }
}
`


// Read
export const _getGame = gql`
query GetGame($language: ID!) {
    Game(id: $id) {
        
        }
    }
`


export const _getUserByName = gql`
query getUser($name: String!) {
    user(username: $name) {
        username
        email
    }
    }
`


export const _getUserById = gql`
query getUser($id: ID!) {
    user(id: $id) {
        username
        email
    }
    }
`


export const _searchQueue = gql`
query {
    queues (where: {createdAt_gt: $date}) {
        created_at
        id
        user_id
        isUser
    }
    }
`


export const _checkMove = gql`
query getMove($game_id: ID!) {
    move(game_id: $game_id) {
        id
        created_at
        request_move
        accept_move
        game_id
        turn
    }
    }
`


//update
export const _acceptInvite = gql`
mutation updateInvite($link: String!) {
    updateInvite(input: { where: {link: $link}, data: { isExpired: true } }) {
        invite {
        created_at
        id
        user_id
        game_id
        }
    }
    }
`

export const _requestMove = gql`
mutation updateMove($game_id: ID!, &request_move: String!) {
    updateMove(input: { where: {game_id: $game_id}, data: {} }) {
        move {
            id
            created_at
            request_move
            accept_move
            game_id
            turn
        }
    }
    }
`