import Axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axios = Axios.create({
  baseURL,
  withCredentials: true,
});

const setToken = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

//! e.g set Authorization header with "getSession()"
// let lastSession: Session | null = null;

//! Request interceptor
axios.interceptors.request.use(async (request) => {
  //! e.g set Authorization header with "getSession()"
  // if (lastSession == null || Date.now() > lastSession.accessTokenExpires!) {
  // const session = await getSession();
  //   lastSession = session;
  // }

  // if (lastSession) {
  //   request.headers.Authorization = `Bearer ${lastSession.accessToken}`;
  // } else {
  //   request.headers.Authorization = undefined;
  // }

  return request;
});

//! Response interceptor
axios.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  (response) => response,
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  (error) => Promise.reject(error)
);

export { axios, setToken };
