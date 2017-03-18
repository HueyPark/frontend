import axios from 'axios'

const url = 'http://127.0.0.1:5000'

export default {
  post: function (endpoint, callback, data) {
    axios.post(url + endpoint, data, { headers: {
      'Content-Type': 'application/json'
    }}).then(function (res) {
      callback(res)
    })
  },
  get: function (endpoint, callback) {
    axios.get(url + endpoint).then(function (res) {
      callback(res)
    })
  }
}
