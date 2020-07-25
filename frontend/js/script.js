let globalUsers = [];
let globalFilteredUsers = [];

async function start() {
  await fetchUsers();

  hideSpinner();
  render();

  configFilter();
}

async function fetchUsers() {
  const resource = await fetch('http://localhost:3001/users');
  const json = await resource.json();

  globalUsers = json.map(({ name, picture, dob, gender }) => {
    return {
      gender: gender,
      age: dob.age,
      userFirstName: name.first,
      userLastName: name.last,
      userPicture: picture.large,
    };
  });

  globalFilteredUsers = [...globalUsers];
}

function hideSpinner() {
  const spinner = document.querySelector('#spinner');

  // A class hide faz parte do Materialize
  spinner.classList.add('hide');
}

function render() {
  const divUsers = document.querySelector('#users');
  const qtdUsers = globalFilteredUsers.length

  if (globalFilteredUsers.length > 0) {
  divUsers.innerHTML = `
  <h4>${qtdUsers} usuário(s) encontrado(s)</h4>
  <ul>
  ${globalFilteredUsers
      .map(({ age, userPicture, userFirstName, userLastName }) => {
        return `
      <li>
      <div class='flex-row border'>
      <img class='avatar' src='${userPicture}' alt='${userFirstName}' />
      <span>${userFirstName} ${userLastName}, ${age}</span>
      </div>
      </li>
      `;
      })
      .join('')}
    </ul>  
    `;
  } else {
    divUsers.innerHTML = `
    <h4>Nenhum usuário filtrado</h4>
    `;
  }

  const divStatistics = document.querySelector('#statistics');
  const masc = globalFilteredUsers.filter(item => item.gender === 'male').length
  const fem = globalFilteredUsers.filter(item => item.gender === 'female').length
  const valorInicial = 0;
  let somaIdades = globalFilteredUsers.reduce(
    (acumulador , valorAtual) => acumulador + valorAtual.age
    ,valorInicial);
  const mediaIdades = somaIdades/globalFilteredUsers.length

  if (globalFilteredUsers.length > 0) {
    divStatistics.innerHTML = `
    <h4>Estatísticas</h4>
    <ul>
      <li>
        Sexo masculino:<bold> ${masc} </bold>
      </li>
      <li>
        Sexo feminino:<bold> ${fem}</bold>
      </li>
      <li>
        Soma das idades:<bold> ${somaIdades}</bold>
      </li>
      <li>
        Média das idades:<bold> ${mediaIdades}</bold>
      </li>
    </ul>    
      `;
    } else {
      divStatistics.innerHTML = `
      <h4>Nada a ser exibido</h4>
      `;
    }
}

function configFilter() {
  debugger
  const buttonFilter = document.querySelector('#buttonFilter');
  const inputFilter = document.querySelector('#inputFilter');

  inputFilter.addEventListener('keyup', handleFilterKeyUp);
  buttonFilter.addEventListener('click', handleButtonClick);
}

function handleButtonClick() {
  const inputFilter = document.querySelector('#inputFilter');
  const filterValue = inputFilter.value.toLowerCase().trim();

  globalFilteredUsers = globalUsers.filter((item) => {
    const fullName = `${item.userFirstName} ${item.userLastName}`
    return fullName.toLowerCase().includes(filterValue);
  });

  render();
  console.log(globalFilteredUsers)
}

function handleFilterKeyUp({ key }) {
  //const { key } = event;

  if (key !== 'Enter') {
    return;
  }

  handleButtonClick();
}

start();
