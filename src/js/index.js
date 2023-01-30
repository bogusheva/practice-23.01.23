const loader = document.querySelector(".loader__box");
const scrollUpButton = document.querySelector(".up-button");
const containerItems = document.querySelector(".movie__container");
const containerButtons = document.querySelector(".button__container");
const selectSpecies = document.querySelector(".select__species");
const selectStatus = document.querySelector(".select__status");
const searchCharacter = document.querySelector(".search__character");

scrollUpButton.addEventListener("click", () => {
  scrollUp();
});
getThemeToggle();
getLoginForm();

if (!localStorage.getItem("favorite")) {
  localStorage.setItem("favorite", JSON.stringify([]));
}
let favoriteCharacters = JSON.parse(localStorage.getItem("favorite"));

fetch(`https://rickandmortyapi.com/api/character`)
  .then((data) => data.json())
  .then((data) => {
    showPage(data.results);
    createButtons(data);
  })
  .catch((err) => console.log("Error:", err));

function getThemeToggle() {
  const bodyContainer = document.querySelector(".body-container");
  const themeToggle = document.querySelector(".theme-toggle__wrapper");
  const themeToggleCircle = document.querySelector(".theme-toggle__circle");

  themeToggle.addEventListener("click", () => {
    themeToggleCircle.classList.toggle("dark");
    bodyContainer.classList.toggle("dark");
  });
}

function getLoginForm() {
  const loginFormButton = document.querySelector(".login__wrapper");
  const loginWindow = document.querySelector(".login-window");
  const loginButton = document.querySelector(".login-button");
  const loginForm = document.querySelector(".login-form");
  const login = document.querySelector(".input__login");
  const password = document.querySelector(".input__password");
  const checkboxArea = document.querySelector(".checkbox-text");
  const checkboxItem = document.querySelector(".input__checkbox");
  const passwordHider = document.querySelector(".password-hider");
  const passwordValidationArea = document.querySelector(".password-validation");

  loginFormButton.addEventListener("click", () => {
    loginWindow.classList.toggle("visible");
    password.setAttribute("type", "password");
    passwordValidationArea.innerText = "";

    login.value = JSON.parse(localStorage.getItem("login"))
      ? JSON.parse(localStorage.getItem("login"))
      : "";
    password.value = JSON.parse(localStorage.getItem("password"))
      ? JSON.parse(localStorage.getItem("password"))
      : "";
    checkboxArea.hidden =
      JSON.parse(localStorage.getItem("login")) &&
      JSON.parse(localStorage.getItem("password"))
        ? true
        : false;
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (checkboxItem.checked === true) {
      localStorage.setItem("login", JSON.stringify(login.value));
      localStorage.setItem("password", JSON.stringify(password.value));
    }
    if (
      (login.value === JSON.parse(localStorage.getItem("login")) &&
        password.value === JSON.parse(localStorage.getItem("password"))) ||
      (login.value === "admin" && password.value === "admin")
    ) {
      passwordValidationArea.style.color = "#16ACC9";
      passwordValidationArea.innerText = `Hello, ${login.value}, come in.`;
      setTimeout(() => {
        loginWindow.classList.toggle("visible");
      }, 2000);
    } else {
      passwordValidationArea.style.color = "red";
      passwordValidationArea.innerText = `Login/password is wrong. Try again`;
    }
  });

  passwordHider.addEventListener("click", () => {
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
  });

  login.addEventListener("keypress", () => {
    passwordValidationArea.innerText = "";
  });

  password.addEventListener("keypress", () => {
    passwordValidationArea.innerText = "";
  });
}

function getAllCharacters(number) {
  const arr = [];
  containerItems.innerHTML = "";
  if (!JSON.parse(sessionStorage.getItem("allCharacters"))) {
    new Promise((resolve, reject) => {
      loader.hidden = false;
      setTimeout(() => {
        for (let i = 1; i <= 400; i++) {
          fetch(`https://rickandmortyapi.com/api/character/${i}`)
            .then((data) => data.json())
            .then((data) => {
              arr.push(data);
            })
            .catch((err) => console.log(err));
        }
        resolve();
      }, 2000);
      setTimeout(() => {
        for (let i = 401; i <= number; i++) {
          fetch(`https://rickandmortyapi.com/api/character/${i}`)
            .then((data) => data.json())
            .then((data) => {
              arr.push(data);
            })
            .catch((err) => console.log(err));
        }
        resolve();
      }, 2000);
    }).catch((err) => console.log("Error: ", err));
    setTimeout(() => {
      if (arr.length === number) {
        sessionStorage.setItem(
          "allCharacters",
          JSON.stringify(arr.sort((a, b) => a.id - b.id))
        );
      }
      showPage(arr.sort((a, b) => a.id - b.id));
      loader.hidden = true;
      console.log(arr.length);
    }, 5000);
  } else {
    showPage(JSON.parse(sessionStorage.getItem("allCharacters")));
  }
}

function showPage(characters) {
  containerItems.innerHTML = "";
  selectSpecies.innerHTML = `<option value="all">all</option>`;
  selectStatus.innerHTML = `<option value="all">all</option>`;
  let selectSpeciesArray = [];
  let selectStatusArray = [];

  characters.map((item) => {
    let newItem = createItem(item);
    containerItems.append(newItem);
    if (!selectSpeciesArray.includes(item.species)) {
      selectSpeciesArray.push(item.species);
    }
    if (!selectStatusArray.includes(item.status)) {
      selectStatusArray.push(item.status);
    }
  });

  selectSpeciesArray.forEach((item) => {
    let newOption = createOption(item);
    selectSpecies.appendChild(newOption);
  });
  selectStatusArray.forEach((item) => {
    let newOption = createOption(item);
    selectStatus.appendChild(newOption);
  });

  selectStatus.onchange = () => {
    selectSpecies.value = "all";
    if (selectStatus.value !== "all") {
      containerItems.innerHTML = "";
      let array = characters.filter(
        (element) => element.status === selectStatus.value
      );
      array.map((item) => {
        let newItem = createItem(item);
        containerItems.append(newItem);
      });
    } else {
      containerItems.innerHTML = "";
      characters.map((item) => {
        let newItem = createItem(item);
        containerItems.append(newItem);
      });
    }
  };

  selectSpecies.onchange = () => {
    selectStatus.value = "all";
    if (selectSpecies.value !== "all") {
      containerItems.innerHTML = "";
      let array = characters.filter(
        (element) => element.species === selectSpecies.value
      );
      array.map((item) => {
        let newItem = createItem(item);
        containerItems.append(newItem);
      });
    } else {
      containerItems.innerHTML = "";
      characters.map((item) => {
        let newItem = createItem(item);
        containerItems.append(newItem);
      });
    }
  };

  searchCharacter.onkeyup = () => {
    selectSpecies.value = "all";
    selectStatus.value = "all";
    containerItems.innerHTML = "";
    if (searchCharacter.value) {
      let array = characters.filter((item) =>
        item.name.toLowerCase().includes(searchCharacter.value)
      );
      array.map((item) => {
        let newItem = createItem(item);
        containerItems.append(newItem);
      });
    } else {
      characters.map((item) => {
        let newItem = createItem(item);
        containerItems.append(newItem);
      });
    }
  };
}

function createItem(element) {
  let item = document.createElement("div");
  let nameOfCharacter = document.createElement("h2");
  let imageOfCharacter = document.createElement("img");
  let genderOfCharacter = document.createElement("div");
  let aliveCharacter = document.createElement("div");
  let specieOfCharacter = document.createElement("div");
  let dateOfBirthCharacter = document.createElement("div");
  let episode = document.createElement("span");
  let heartIcon = document.createElement("span");

  item.classList.add("movie__item");
  nameOfCharacter.classList.add("movie__name");
  imageOfCharacter.classList.add("movie__img");
  genderOfCharacter.classList.add("movie__gen");
  aliveCharacter.classList.add("movie__alive");
  specieOfCharacter.classList.add("movie__species");
  dateOfBirthCharacter.classList.add("movie__data");
  episode.classList.add("movie__episode");
  heartIcon.classList.add("icon-heart");
  heartIcon.classList.add("icon-heart_unactive");
  favoriteCharacters.forEach((item) => {
    if (item.id == element.id) {
      heartIcon.classList.add("favorite");
    }
  });
  heartIcon.addEventListener("click", () => {
    heartIcon.classList.toggle("favorite");
    let isInArray = favoriteCharacters.some((item) => item.id == element.id);
    if (!isInArray) {
      favoriteCharacters.push(element);
    } else {
      for (let i = 0; i < favoriteCharacters.length; i++) {
        if (favoriteCharacters[i].id == element.id) {
          favoriteCharacters.splice(i, 1);
        }
      }
    }
    localStorage.setItem("favorite", JSON.stringify(favoriteCharacters));
  });

  nameOfCharacter.innerHTML = element.name;
  genderOfCharacter.innerHTML = `Gender: <b> ${element.gender} </b>`;
  aliveCharacter.innerHTML = `Health status: <b> ${element.status} </b>`;
  specieOfCharacter.innerHTML = `Specie: <b> ${element.species} </b>`;
  dateOfBirthCharacter.innerHTML = `
            First Appearance: <i> ${element.created.slice(0, 10)} </i>
            `;
  episode.innerHTML = `Episode: <b"> ${element.episode[0].slice(40)} </b>`;
  imageOfCharacter.src = element.image;
  if (element.status === "Dead") {
    item.classList.add("movie__item_dead");
  } else if (element.status === "Alive") {
    item.classList.add("movie__item_alive");
  }
  episode.addEventListener("click", () => {
    scrollUp();
    fetch(
      `https://rickandmortyapi.com/api/episode/${element.episode[0].slice(40)}`
    )
      .then((data) => data.json())
      .then((data) => {
        createEpisodeWindow(data);
      })
      .catch((err) => console.log("Error:", err));
  });

  item.append(
    heartIcon,
    nameOfCharacter,
    imageOfCharacter,
    genderOfCharacter,
    aliveCharacter,
    specieOfCharacter,
    dateOfBirthCharacter,
    episode
  );

  return item;
}

function createOption(element) {
  let option = document.createElement("option");
  option.setAttribute("value", element);
  option.innerText = element;
  return option;
}

function createButtons(data) {
  for (let i = 1; i <= data.info.pages; i++) {
    let buttonPage = document.createElement("span");
    buttonPage.classList.add("button");
    buttonPage.value = i;
    buttonPage.innerText = `Page ${i}`;
    containerButtons.appendChild(buttonPage);

    buttonPage.addEventListener("click", (e) => {
      searchCharacter.value = "";
      changeActiveButton();
      buttonPage.classList.add("active");
      fetch(`https://rickandmortyapi.com/api/character?page=${e.target.value}`)
        .then((data) => data.json())
        .then((data) => showPage(data.results))
        .catch((err) => console.log("Error:", err));
    });
  }
  document.querySelectorAll(".button")[2].classList.add("active");

  let favoriteButton = document.querySelector(".show-favorite");
  favoriteButton.addEventListener("click", () => {
    containerItems.innerHTML = "";
    changeActiveButton();
    favoriteButton.classList.add("active");
    favoriteCharacters.map((item) => {
      let newItem = createItem(item);
      containerItems.append(newItem);
    });
  });

  let showAllButton = document.querySelector(".all-button");
  showAllButton.addEventListener("click", (e) => {
    changeActiveButton();
    showAllButton.classList.add("active");
    getAllCharacters(data.info.count);
  });
}

function createEpisodeWindow(data) {
  let episodeWindow = document.createElement("div");
  episodeWindow.classList.add("episode__window");
  let episodeName = document.createElement("h2");
  let episodeAirDate = document.createElement("h3");
  let episodeCharactersContainer = document.createElement("div");
  let episodeCharacterHeading = document.createElement("h4");
  let closeButton = document.createElement("span");

  episodeName.classList.add("episode__name");
  episodeAirDate.classList.add("episode__date");
  episodeCharactersContainer.classList.add("episode__characters_container");
  closeButton.classList.add("button_close");

  closeButton.addEventListener("click", () => {
    episodeWindow.remove();
  });

  episodeName.innerText = `Episode: ${data.episode} - ${data.name}`;
  episodeAirDate.innerText = `Air Date: ${data.air_date}`;
  episodeCharacterHeading.innerText = "Characters:";
  closeButton.innerText = "Close";

  data.characters.map((item) => {
    fetch(item)
      .then((data) => data.json())
      .then((data) => {
        let newItem = createWindowItem(data);
        episodeCharactersContainer.appendChild(newItem);
      })
      .catch((err) => console.log("Error:", err));
  });

  episodeWindow.append(
    episodeName,
    episodeAirDate,
    episodeCharacterHeading,
    episodeCharactersContainer,
    closeButton
  );
  document.querySelector(".body-container").appendChild(episodeWindow);
}

function createWindowItem(data) {
  let item = document.createElement("div");
  let nameOfCharacter = document.createElement("h2");
  let imageOfCharacter = document.createElement("img");

  item.classList.add("movie__item");
  nameOfCharacter.classList.add("movie__name");
  imageOfCharacter.classList.add("movie__img");

  nameOfCharacter.innerText = data.name;
  imageOfCharacter.src = data.image;

  item.append(nameOfCharacter, imageOfCharacter);

  return item;
}

function changeActiveButton() {
  searchCharacter.value = "";
  let buttonPages = document.querySelectorAll(".button");
  for (let i = 0; i < buttonPages.length; i++) {
    if (buttonPages[i].classList.contains("active")) {
      buttonPages[i].classList.remove("active");
    }
  }
}

function scrollUp() {
  window.scrollTo({
    top: 100,
    behavior: "smooth",
  });
}
