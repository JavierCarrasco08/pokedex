import { Pokedex } from "./Pokemones.js";

const d = document,
  $template = d.getElementById("template").content,
  w = window,
  $sectionPokemon = d.querySelector(".container_pokemones"),
  $containerButtons = d.querySelector(".buttons"),
  fragmen = d.createDocumentFragment();
// Pokedex
d.addEventListener("DOMContentLoaded", async () => {
  Pokedex("https://pokeapi.co/api/v2/pokemon");
});
// Buscador
const buscador = async (buscador) => {
  try {
    const $loader = d.querySelector(".loader");
    $loader.classList.add("block");
    const buscarFragment = d.createDocumentFragment();
    // if (buscador === "") {
    //   return Pokedex("https://pokeapi.co/api/v2/pokemon");
    // }
    let buscar = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${buscador.toLowerCase()}`
      ),
      res = await buscar.json();

    if (!buscar.ok) throw buscar;
    $loader.classList.remove("block");
    $template.querySelector(".container_card_pokemon").dataset.id = res.name;
    $template.querySelector(".nombre").textContent = res.species.name;
    $template
      .querySelector(".img_pokemon")
      .setAttribute(
        "src",
        `${res.sprites.other["official-artwork"]["front_default"]}`
      );
    console.log(res);
    let $clone = d.importNode($template, true);
    buscarFragment.appendChild($clone);
    $sectionPokemon.appendChild(buscarFragment);
  } catch (err) {
    const $loader = d.querySelector(".loader");
    $loader.classList.remove("block");
    $template
      .querySelector(".img_pokemon")
      .setAttribute("src", "assets/images/exit.svg");
    $template.querySelector(".nombre").textContent =
      "Lo sentimos este Pokemon aun no se encuentra!";
    let $advertencia = d.importNode($template, true);
    $sectionPokemon.appendChild($advertencia);
  }
};
// Eventos

d.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.matches("#buscador")) {
    const $buscador = e.target.buscar.value;
    const $card = d.querySelectorAll(".container_card_pokemon");
    $card.forEach((e) => $sectionPokemon.removeChild(e));
    buscador($buscador);
  }
});

d.addEventListener("click", async (e) => {
  if (e.target.matches(".next")) {
    e.target.disabled = true;
    const $card = d.querySelectorAll(".container_card_pokemon");
    $card.forEach((e) => $sectionPokemon.removeChild(e));
    await Pokedex(e.target.getAttribute("data-next"));
    e.target.disabled = false;
  }
  if (e.target.matches(".prev")) {
    e.target.disabled = true;
    const $card = d.querySelectorAll(".container_card_pokemon");
    $card.forEach((e) => $sectionPokemon.removeChild(e));
    await Pokedex(e.target.getAttribute("data-prev"));
    e.target.disabled = false;
  }
  if (e.target.matches(".exit *")) {
    const $modal = d.querySelector(".container_modal");
    $modal.classList.remove("isActive");
  }
  if (e.target.matches(".container_card_pokemon *")) {
    const $modal = d.querySelector(".container_modal");
    let pokemon = e.target.parentNode.parentElement.dataset.id;
    let elementoDelModal = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      ),
      json2 = await elementoDelModal.json();
    if (!elementoDelModal.ok) {
      const err = "hubo un error";
      $modal.firstElementChild.textContent = err;
      $modal.classList.add("isActive");
      return false;
    }
    console.log(json2);
    $modal.querySelector(".type").textContent = json2.types[0]["type"]["name"];
    $modal.querySelector(".type").textContent += json2.types[1]
      ? `/${json2.types[1]["type"]["name"]}.`
      : ".";
    $modal
      .querySelector(".image")
      .setAttribute(
        "src",
        `${json2.sprites.other["official-artwork"]["front_default"]}`
      );
    $modal.querySelector(".nombre").textContent = json2.name;
    $modal.querySelector(
      ".hp"
    ).textContent = `Hp: ${json2.stats[0]["base_stat"]}`;
    $modal.querySelector(
      ".attack"
    ).textContent = `Attack: ${json2.stats[1]["base_stat"]}`;
    $modal.querySelector(
      ".defense"
    ).textContent = `Defense: ${json2.stats[2]["base_stat"]}`;
    $modal.querySelector(
      ".special-attack"
    ).textContent = `Special-attack: ${json2.stats[3]["base_stat"]}`;
    $modal.querySelector(
      ".special-defense"
    ).textContent = `Special-defense: ${json2.stats[4]["base_stat"]}`;
    $modal.querySelector(
      ".speed"
    ).textContent = `Speed: ${json2.stats[5]["base_stat"]}`;
    $modal.classList.add("isActive");
  }
});

w.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    const $modal = d.querySelector(".container_modal");
    $modal.classList.remove("isActive");
  }
});

d.addEventListener("input", (e) => {
  if (e.target.matches("#buscar")) {
    if (e.target.value === "") {
      const $card = d.querySelectorAll(".container_card_pokemon");
      $card.forEach((e) => $sectionPokemon.removeChild(e));
      Pokedex("https://pokeapi.co/api/v2/pokemon");
    }
  }
});
