
// export const API = process.env.REACT_APP_API || 'http://localhost:18012';
export const API = process.env.REACT_APP_API || 'https://opd-system.onrender.com';
export function authHeader(){
const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: "Bearer " + token };
}