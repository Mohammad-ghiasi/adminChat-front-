import axios from 'axios';

export default axios.create({
  baseURL: 'https://admin-chat.liara.run',
  withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
});
