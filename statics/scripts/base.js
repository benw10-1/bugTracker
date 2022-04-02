var loaded = {},
  userCont,
  login,
  dropdown,
  logo,
  sendLogin;
const images = ['logo.png'];

function loadImages() {
  for (const x of images) {
    let img = new Image(75, 75);
    img.src = '/images/' + x;
    loaded[x.split('.')[0]] = img;
  }
}

const newProjectHandler = async (event) => {
  event.preventDefault();

  const response = await fetch('/api/projects');
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#name-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && email && password) {
    const response = await fetch('/api/user/create', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
};

function loadEls() {
  logo = document.querySelector('.logo');
  userCont = document.querySelector('.user-cont');
  login = document.querySelector('.showPopup');
  dropdown = document.querySelector('.dropdown');
  sendLogin = document.querySelector('.sendLogin');

  window.addEventListener('click', (event) => {
    if (event.target !== login && event.path.indexOf(dropdown) < 0)
      toggleDropdown(false);
  });
  logo.appendChild(loaded.logo.cloneNode());
  if (login) loggedOut();
  else loggedIn();
}

function loggedOut() {
  login.addEventListener('mousedown', () => {
    toggleDropdown();
  });
  sendLogin.addEventListener('click', (event) => {
    sendLogin.innerHTML = 'Loading...';
    sendLogin.classList.add('selected');
    let user = document.querySelector("input[name='user']").value;
    let pass = document.querySelector("input[name='pass']").value;
    postLogin(user, pass).then((data) => {
      sendLogin.innerHTML = 'Login ->';
      sendLogin.classList.remove('selected');
    });
  });
}

function postLogin(user, pass) {
  if (!user || !pass) return new Promise((res) => res({}));
  const link = window.location.origin + '/api/user/login';

  const options = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: user, password: pass }),
  };

  return fetch(link, options)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      if (data.status === 'ok') {
        window.location.replace(window.location.origin + '/projects');
        console.log('>>>>>>>login post');
      }
      return data;
    });
}

function toggleDropdown(cond) {
  if (!dropdown) return;
  if (typeof cond === 'undefined') {
    login.classList.toggle('selected');
    dropdown.classList.toggle('shown');
    return;
  }
  if (cond) {
    dropdown.classList.add('shown');
    login.classList.add('selected');
  } else {
    login.classList.remove('selected');
    dropdown.classList.remove('shown');
  }
}

const goToProjectHandler = async (event) => {
  event.preventDefault();
};

document
  .getElementById('signup-form')
  .addEventListener('click', signupFormHandler);
