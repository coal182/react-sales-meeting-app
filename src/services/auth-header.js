import Cookies from 'js-cookie';

export default function authHeader() {
    const user = JSON.parse(Cookies.get('user'));
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    } else {
      return {};
    }
}