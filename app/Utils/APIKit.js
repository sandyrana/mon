import axios from 'axios';
let APIKit = axios.create({
  baseURL: 'https://moonvalleynurseries.com/',
  //baseURL: 'https://moonvalleydev.99stockpics.com/',
  timeout: 10000,
});
export default APIKit;