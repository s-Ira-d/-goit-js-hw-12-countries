import debounce from "lodash.debounce";
import fetchCountries from "./fetchCountries";
import { error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const input = document.getElementById("search-box");
const countryList = document.getElementById("country-list");
const countryInfo = document.getElementById("country-info");

input.addEventListener("input", debounce(onInput, 500));

function onInput(e) {
  const query = e.target.value.trim();

  if (!query) {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
    return;
  }

  fetchCountries(query)
    .then((countries) => {
      countryList.innerHTML = "";
      countryInfo.innerHTML = "";

      if (countries.length > 10) {
        error({
          text: "занадто багато результатів. введіть більш специфічний запит.",
        });
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      } else {
        renderCountryList(countries);
      }
    })
    .catch(() => {
      error({ text: "країну не знайдено" });
      countryList.innerHTML = "";
      countryInfo.innerHTML = "";
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(
      (country) => `<li>
        <img src="${country.flags.svg}" alt="${country.name}" width="30">
        ${country.name}
      </li>`
    )
    .join("");
  countryList.innerHTML = `<ul>${markup}</ul>`;
}

function renderCountryInfo(country) {
  countryInfo.innerHTML = `
    <h2>
      <img src="${country.flags.svg}" alt="${country.name}" width="50">
      ${country.name}
    </h2>
    <p>Столиця: ${country.capital}</p>
    <p>Населення: ${country.population}</p>
    <p>Мови: ${country.languages.map((lang) => lang.name).join(", ")}</p>
  `;
}
