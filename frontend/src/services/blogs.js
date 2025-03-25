import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null


const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// const getAll = () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  console.log('newObject :', newObject);
  try {
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
  } catch (error) {
    // if (error.response?.status === 401) { //and response body = "error":"token expired"
    //   throw new Error('Authentication failed: Please log in again');
    // }
    throw error //non-401 errors
  }
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

const upLike = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(config)
  const response = await axios.put(`${ baseUrl }/like/${id}`, null, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(config)
  const response = await axios.delete(`${ baseUrl }/${id}`, config)
  return response.data
}

export default { getAll, create, update, setToken, upLike, remove }