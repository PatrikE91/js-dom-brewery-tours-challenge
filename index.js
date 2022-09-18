let data = "https://api.openbrewerydb.org/breweries?per_page=10&page=1";
let localState = {};

function addPub(pub) {
  const listPubs = document.querySelector(".breweries-list");
  const liEl = document.createElement("li");

  const pubName = document.createElement("h2");
  const div = document.createElement("div");
  const addressSection = document.createElement("section");
  const addressTitle = document.createElement("h3");
  const road = document.createElement("p");
  const cityAndPostalCode = document.createElement("p");
  const phoneSection = document.createElement("section");
  const phoneTitle = document.createElement("h3");
  const phoneNumber = document.createElement("p");
  const websiteSection = document.createElement("section");
  const websiteLink = document.createElement("a");

  liEl.className = "single-brewery";
  pubName.innerText = pub.name;
  div.className = "type";
  div.innerText = pub.brewery_type;
  addressSection.className = "address";
  addressTitle.innerText = "Address:";
  road.innerText = pub.street;
  cityAndPostalCode.innerText = pub.city + ", " + pub.postal_code;
  cityAndPostalCode.style.fontWeight = "900";
  phoneSection.className = "phone";
  phoneTitle.innerText = "Phone:";
  phoneNumber.innerText = pub.phone;
  websiteSection.className = "link";

  websiteLink.href = pub.website_url;
  websiteLink.innerText = "Visit Website";

  listPubs.append(liEl);
  liEl.append(pubName, div, addressSection, phoneSection, websiteSection);
  addressSection.append(addressTitle, road, cityAndPostalCode);
  phoneSection.append(phoneTitle, phoneNumber);
  websiteSection.append(websiteLink);
}

function addBrewery(pubs) {
  pubs.forEach((pub) => addPub(pub));
}

function submitFormState() {
  const listPubs = document.querySelector(".breweries-list");
  const selectedState = document.querySelector("#select-state");
  const form = document.querySelector("#select-state-form");
  const div = document.querySelector(".filter-by-city-heading");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const str = selectedState.value;
    const valueLowerCase = str.charAt(0).toLowerCase() + str.slice(1);

    let newData = `https://api.openbrewerydb.org/breweries?by_state=${valueLowerCase}&per_page=10`;
    fetch(newData)
      .then(function (response) {
        return response.json();
      })
      .then(function (pubs) {
        localState = pubs;
        const newState = localState.filter(
          (el) =>
            el.brewery_type === "micro" ||
            el.brewery_type === "brewpub" ||
            el.brewery_type === "regional"
        );
        div.innerHTML = "";
        listPubs.innerHTML = "";
        addBrewery(newState);
      });
  });
}

function filterByType() {
  const listPubs = document.querySelector(".breweries-list");
  const selection = document.querySelector("#filter-by-type");

  selection.addEventListener("change", (e) => {
    e.preventDefault();
    let localState1 = localState.filter(
      (el) => el.brewery_type === selection.value
    );

    listPubs.innerHTML = "";
    addBrewery(localState1);
  });
}

function filterByCity() {
  const aside = document.querySelector(".filters-section");
  const div = document.createElement("div");

  div.className = "filter-by-city-heading";

  aside.append(div);
}

const form = document.createElement("form");
function cityForm() {
  const listPubs = document.querySelector(".breweries-list");
  const h3El = document.createElement("h3");
  const aside = document.querySelector(".filters-section");
  const div = document.querySelector(".filter-by-city-heading");
  const buttonClearAll = document.createElement("button");

  form.setAttribute("id", "filter-by-city-form");
  buttonClearAll.innerText = "clear all";
  buttonClearAll.className = "clear-all-btn";
  h3El.innerText = "Cities";

  div.append(h3El, buttonClearAll);
  aside.append(form);
  buttonClearAll.addEventListener("click", () => {
    listPubs.innerHTML = "";
    addBrewery(localState);
    form.reset();
  });

  const newLocalState = localState.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.city === value.city)
  );

  newLocalState.sort(function (a, b) {
    return a.city.localeCompare(b.city);
  });

  const arrValues = [];

  newLocalState.forEach((el) => {
    const input = document.createElement("input");
    const label = document.createElement("label");

    input.setAttribute("type", "checkbox");
    input.setAttribute("name", el.city);
    input.setAttribute("value", el.city);
    label.setAttribute("for", el.city);
    label.innerText = el.city;

    form.append(input, label);

    input.addEventListener("change", (e) => {
      if (!e.target) {
        readData(data);
      }
      if (e.target.checked) {
        if (arrValues.includes(e.target.value)) {
        } else {
          arrValues.push(e.target.value);
        }
      } else {
        if (arrValues.includes(e.target.value)) {
          arrValues.splice(arrValues.indexOf(e.target.value), 1);
        }
      }

      let newSate = [];

      if (newSate.length <= 0) {
      }
      localState.filter((el) => {
        if (arrValues.includes(el.city)) {
          newSate.push(el);
        }
        return;
      });
      listPubs.innerHTML = "";
      addBrewery(newSate);
    });
  });
}

function submitFormName() {
  const listPubs = document.querySelector(".breweries-list");
  const h1el = document.querySelector("h1");
  const searchBar = document.createElement("header");
  const form = document.createElement("form");
  const lable = document.createElement("lable");
  const h2El = document.createElement("h2");
  const input = document.createElement("input");

  searchBar.className = "serach-bar";
  form.setAttribute("id", "search-breweries-form");
  form.setAttribute("autocomplete", "off");
  h2El.innerText = "Search breweries:";
  lable.setAttribute("for", "search-breweries");
  input.setAttribute("id", "search-breweries");
  input.setAttribute("name", "search-breweries");
  input.setAttribute("type", "text");

  h1el.after(searchBar);
  searchBar.append(form);
  form.append(lable, input);
  lable.append(h2El);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const str = input.value;
    const valueLowerCase = str.toLowerCase();
    let newData = `https://api.openbrewerydb.org/breweries?by_name=${valueLowerCase}&per_page=10`;
    fetch(newData)
      .then(function (response) {
        return response.json();
      })
      .then(function (pubs) {
        localState = pubs;

        const newState = localState.filter(
          (el) =>
            el.brewery_type === "micro" ||
            el.brewery_type === "brewpub" ||
            el.brewery_type === "regional"
        );
        listPubs.innerHTML = "";
        addBrewery(newState);
      });
  });
}

let input = 1;
function increase() {
  const div = document.querySelector(".filter-by-city-heading");
  const listPubs = document.querySelector(".breweries-list");
  const nextButton = document.getElementById("next-button");
  const form = document.getElementById("filter-by-city-form");

  nextButton.addEventListener("click", () => {
    input++;
    data = `https://api.openbrewerydb.org/breweries?per_page=10&page=${input}`;
    fetch(data)
      .then(function (response) {
        return response.json();
      })
      .then(function (pubs) {
        localState = pubs;
        const newState = localState.filter(
          (el) =>
            el.brewery_type === "micro" ||
            el.brewery_type === "brewpub" ||
            el.brewery_type === "regional"
        );
        div.innerHTML = "";
        listPubs.innerHTML = "";
        form.innerHTML = "";
        addBrewery(newState);
        cityForm();
      });
  });
}

function decrease() {
  const div = document.querySelector(".filter-by-city-heading");
  const listPubs = document.querySelector(".breweries-list");
  const prevButton = document.getElementById("prev-button");
  const form = document.getElementById("filter-by-city-form");

  prevButton.addEventListener("click", () => {
    if (input < 1) {
      return;
    }
    input--;
    data = `https://api.openbrewerydb.org/breweries?per_page=10&page=${input}`;
    fetch(data)
      .then(function (response) {
        return response.json();
      })
      .then(function (pubs) {
        localState = pubs;

        const newState = localState.filter(
          (el) =>
            el.brewery_type === "micro" ||
            el.brewery_type === "brewpub" ||
            el.brewery_type === "regional"
        );
        div.innerHTML = "";
        listPubs.innerHTML = "";
        form.innerHTML = "";
        addBrewery(newState);
        cityForm();
      });
  });
}

function readData(data) {
  fetch(data)
    .then(function (response) {
      return response.json();
    })
    .then(function (pubs) {
      localState = pubs;
      const newState = localState.filter(
        (el) =>
          el.brewery_type === "micro" ||
          el.brewery_type === "brewpub" ||
          el.brewery_type === "regional"
      );
      setState(newState);
      addBrewery(newState);
      filterByType();
      filterByCity();
      cityForm();
      submitFormState();
      submitFormName();
      increase();
      decrease();
    });
}

function setState(pubs) {
  localState = [...pubs];
}

function init() {
  readData(data);
}

init();
