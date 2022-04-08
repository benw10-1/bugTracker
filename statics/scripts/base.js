var loaded = {},
  userCont,
  login,
  dropdown,
  logo,
  sendLogin,
  chart;
const images = ['logo.png'];

function loadImages() {
  for (const x of images) {
    let img = new Image(75, 75);
    img.src = '/images/' + x;
    loaded[x.split('.')[0]] = img;
  }
}

const dropDownToggle = async (event) => {
  event.preventDefault();

  if (
    event.target.hasAttribute('set-priority') ||
    event.target.hasAttribute('update-priority')
  ) {
    const dropdownDiv = event.target.parentNode;
    const dropdownMenu = dropdownDiv.children[1];

    dropdownMenu.classList.toggle('show');
  }
};

const setPriority = async (event) => {
  event.preventDefault();

  document.getElementById('setDropdown').textContent = event.target.textContent;

  document.getElementById('actual-drop').classList.toggle('show');
};

const updatePriority = async (event) => {
  event.preventDefault();

  document.getElementById('updateDropdown').textContent =
    event.target.textContent;

  document.getElementById('second-drop').classList.toggle('show');
};

const logoutButtonHandler = async (event) => {
  event.preventDefault();

  const response = await fetch(`/api/user/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace(`/`);
  }
};

const deleteBugHandler = async (event) => {
  event.preventDefault();
  const pathname = window.location.pathname;
  const projectId = pathname.split('/')[2];
  if (event.target.hasAttribute('bug-id')) {
    const bugId = event.target.getAttribute('bug-id');
    const response = await fetch(`/api/bugs/${bugId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        projectid: projectId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      document.location.replace(`/projects/${projectId}`);
    } else {
      document.getElementById(
        'warning-bug'
      ).textContent = `ERROR: Unable to delete bug`;
      setTimeout(() => document.location.reload(), 1000);
    }
  }
};
const deleteContributorHandler = async (event) => {
  event.preventDefault();
  const pathname = window.location.pathname;
  const projectId = pathname.split('/')[2];
  if (event.target.hasAttribute('contributor-id')) {
    const contributorId = event.target.getAttribute('contributor-id');
    const response = await fetch(`/api/contributors/${contributorId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        projectid: projectId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      document.location.replace(`/projects/${projectId}`);
    } else {
      document.getElementById(
        'warning-contributor'
      ).textContent = `ERROR: Unable to delete contributor`;
      setTimeout(() => document.location.reload(), 1000);
    }
  }
};

const deleteProjectHandler = async (event) => {
  event.preventDefault();

  if (event.target.hasAttribute('project-id')) {
    const projectId = event.target.getAttribute('project-id');
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      document.location.replace(`/dashboard`);
    }
  }
};

const newBugHandler = async (event) => {
  event.preventDefault();

  const bugTitle = document.getElementById('new-bug-title').value;
  const bugDesc = document.getElementById('new-bug-desc').value;
  const bugStatus = document.getElementById('setDropdown').textContent.trim();
  const pathname = window.location.pathname;
  const projectId = pathname.split('/')[2];
  if (bugTitle && bugDesc && bugStatus != 'Choose a priority level...') {
    console.log(typeof bugStatus);
    const response = await fetch('/api/bugs', {
      method: 'POST',
      body: JSON.stringify({
        title: bugTitle,
        description: bugDesc,
        projectid: projectId,
        status: bugStatus,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace(`/projects/${projectId}`);
    } else {
      alert(response.statusText);
    }
  }
};

const updateBugHandler = async (event) => {
  event.preventDefault();
  const bugId = event.target.getAttribute('update-bug-id');
  const bugTitle = document.getElementById('update-bug-title').value.trim();
  const bugDesc = document.getElementById('update-bug-desc').value.trim();
  const bugStatus = document
    .getElementById('updateDropdown')
    .textContent.trim();
  const pathname = window.location.pathname;
  const projectId = pathname.split('/')[2];
  if (bugTitle && bugDesc && bugStatus != 'Choose a priority level...') {
    const response = await fetch(`/api/bugs/${bugId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: bugTitle,
        description: bugDesc,
        status: bugStatus,
        projectid: projectId,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace(`/projects/${projectId}`);
    }
  }
};

const newContributorHandler = async (event) => {
  event.preventDefault();

  const contributorName = document.getElementById('new-contr-name').value;
  const contributorEmail = document.getElementById('new-contr-email').value;
  const pathname = window.location.pathname;
  const projectId = pathname.split('/')[2];

  if (contributorName && contributorEmail) {
    const response = await fetch('/api/contributors/create', {
      method: 'POST',
      body: JSON.stringify({
        name: contributorName,
        email: contributorEmail,
        projectid: projectId,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
};

const newProjectHandler = async (event) => {
  event.preventDefault();

  const projectName = document.getElementById('new-proj-name').value;
  const projectDesc = document.getElementById('new-proj-desc').value;

  if (projectName && projectDesc) {
    const response = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: projectName, description: projectDesc }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    }
  }
};

function formError(err) {
  console.log(err);
}

const signupFormHandler = async (event) => {
  event.preventDefault();
  const username = document.querySelector('#name-signup');
  const email = document.querySelector('#email-signup');
  const password = document.querySelector('#password-signup');

  if (username && email && password) {
    const response = await fetch('/api/user/create', {
      method: 'POST',
      body: JSON.stringify({
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/verifyEmail');
    } else {
      formError(response.json());
    }
  }
};

const loginFormHandler = async (event) => {
  event.preventDefault();
  const username = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value.trim();

  if (username && password) {
    response = await fetch('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({ user: username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      formError(response.statusText);
    }
  }
};

function loadEls() {
  logo = document.querySelector('.logo');
  userCont = document.querySelector('.user-cont');
  login = document.querySelector('.showPopup');
  dropdown = document.querySelector('.dropdown');
  sendLogin = document.querySelector('.sendLogin');

  if (document.getElementById('set-low'))
    document.getElementById('set-low').addEventListener('click', setPriority);

  if (document.getElementById('set-medium'))
    document
      .getElementById('set-medium')
      .addEventListener('click', setPriority);

  if (document.getElementById('set-high'))
    document.getElementById('set-high').addEventListener('click', setPriority);

  if (document.getElementById('update-low'))
    document
      .getElementById('update-low')
      .addEventListener('click', updatePriority);

  if (document.getElementById('update-medium'))
    document
      .getElementById('update-medium')
      .addEventListener('click', updatePriority);

  if (document.getElementById('update-high'))
    document
      .getElementById('update-high')
      .addEventListener('click', updatePriority);

  if (document.getElementById('setDropdown'))
    document
      .getElementById('setDropdown')
      .addEventListener('click', dropDownToggle);

  if (document.getElementById('updateDropdown'))
    document
      .getElementById('updateDropdown')
      .addEventListener('click', dropDownToggle);

  if (document.getElementById('delete-project'))
    document
      .getElementById('delete-project')
      .addEventListener('click', deleteProjectHandler);

  if (document.getElementById('update-bug'))
    document
      .getElementById('update-bug')
      .addEventListener('click', updateBugHandler);

  if (document.getElementById('logout'))
    document
      .getElementById('logout')
      .addEventListener('click', logoutButtonHandler);

  if (document.getElementById('bug-id'))
    document
      .getElementById('bug-id')
      .addEventListener('click', deleteBugHandler);

  if (document.getElementById('contributor-id'))
    document
      .getElementById('contributor-id')
      .addEventListener('click', deleteContributorHandler);

  if (document.getElementById('new-contributor'))
    document
      .getElementById('new-contributor')
      .addEventListener('click', newContributorHandler);

  if (document.getElementById('add-new-bug'))
    document
      .getElementById('add-new-bug')
      .addEventListener('click', newBugHandler);
  if (document.getElementById('new-project') != null)
    document
      .getElementById('new-project')
      .addEventListener('click', newProjectHandler);

  if (document.getElementById('signup-form') != null)
    document
      .getElementById('signup-form')
      .addEventListener('click', signupFormHandler);

  if (document.getElementById('login-button') != null)
    document
      .getElementById('login-button')
      .addEventListener('click', loginFormHandler);
  if (document.getElementById("graph")) {
    let data = {LOW: 0, MEDIUM: 0, HIGH: 0}
    let bugs = document.querySelectorAll(".table-bug tbody")
    if (bugs && bugs.length > 0) {
      for (const x of bugs) {
        data[x.children[0].children[4].innerHTML] += 1
      }
      loadChart([data.LOW, data.MEDIUM, data.HIGH])
    }
  }
    
  window.addEventListener('click', (event) => {
    if (event.target !== login && event.path.indexOf(dropdown) < 0)
      toggleDropdown(false);
  });
  if (login) loggedOut();
  if (logo) logo.appendChild(loaded.logo.cloneNode());
}

function loadChart(data) {
  const ctx = document.getElementById('graph')
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: ["Low", "Medium", "High"],
          datasets: [
            {
              label: '# of Bugs',
              data: data ?? [0, 0, 0],
              backgroundColor: [
                  'rgba(54, 162, 235, 0.5)',
                  'rgba(255, 215, 0, 0.5)',
                  'rgba(212, 0, 0, 0.5)',
              ],
              borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 215, 0, 1)',
                  'rgba(212, 0, 0, 1)',
              ],
              borderWidth: 2
          },
        ]
      },
  })
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

async function postLogin(user, pass) {
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
