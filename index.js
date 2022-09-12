let data = "https://api.openbrewerydb.org/breweries?by_state=";

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

function submitForm() {
  const listPubs = document.querySelector(".breweries-list");
  const form = document.querySelector("#select-state-form");
  const selectedState = document.querySelector("#select-state");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let newData = data + selectedState.value;
    fetch(newData)
      .then(function (response) {
        return response.json();
      })
      .then(function (pubs) {
        console.log(pubs);
        listPubs.innerHTML = "";
        return addBrewery(pubs);
      });
    //   form.reset();
  });
}

function filterByType() {
  const listPubs = document.querySelector(".breweries-list");
  const selection = document.querySelector("#filter-by-type");

  selection.addEventListener("change", (e) => {
    e.preventDefault();
    console.log(selection.value);

    let newData =
      "https://api.openbrewerydb.org/breweries?by_type=" +
      selection.value;

    fetch(newData)
      .then(function (response) {
        return response.json();
      })
      .then(function (pubs) {
        console.log("test filtered pubs", pubs);
        listPubs.innerHTML = "";
        return addBrewery(pubs);
      });
  });
}
filterByType();
function init() {
  fetch(data)
    .then(function (response) {
      return response.json();
    })
    .then(function (pubs) {
      addBrewery(pubs);
      // console.log(pubs)
    });
  submitForm();
}

init();
