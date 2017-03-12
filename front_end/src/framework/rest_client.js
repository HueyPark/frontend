import axios from 'axios'

const url = 'http://127.0.0.1:5000'

export default {
  get: function (endpoint, callback) {
    axios.get(url + endpoint).then(function (res) {
      callback(res)
    })
  }
}
