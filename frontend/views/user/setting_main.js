// setting_main.js
import { checkLogin } from '../../js/utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = checkLogin();
});