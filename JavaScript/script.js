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
    if (buscador === "") {
      return Pokedex("https://pokeapi.co/api/v2/pokemon");
    }
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
    $modal.querySelectorAll(".progressive").forEach((e) => {
      e.classList.remove("clip");
    });
    $modal.querySelectorAll(".estadisticas span").forEach((e) => {
      e.classList.remove("opacity");
    });
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
    $modal.querySelector(".type").innerHTML = "";
    json2.types.forEach((e) => {
      const $span = `<span class="${e.type.name}">${e.type.name}</span>`;
      $modal.querySelector(".type").innerHTML += $span;
    });
    $modal
      .querySelector(".image")
      .setAttribute(
        "src",
        `${json2.sprites.other["official-artwork"]["front_default"]}`
      );
    const all = $modal.querySelectorAll(".estadisticas");
    $modal.querySelector(".nombre").textContent = json2.name;
    all.forEach((e, index) => {
      e.firstElementChild.textContent = json2.stats[index].stat.name;
      e.firstElementChild.nextElementSibling.style.width = `${
        json2.stats[index]["base_stat"] / 2.5
      }%`;
      e.lastElementChild.textContent = json2.stats[index]["base_stat"];
    });
    $modal.classList.add("isActive");

    setTimeout(() => {
      $modal.querySelectorAll(".progressive").forEach((e) => {
        e.classList.add("clip");
      });
      $modal.querySelectorAll(".estadisticas span").forEach((e) => {
        e.classList.add("opacity");
      });
    }, 1500);
  }
});

w.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    const $modal = d.querySelector(".container_modal");
    $modal.querySelectorAll(".progressive").forEach((e) => {
      console.log(e);
      e.classList.remove("clip");
    });
    $modal.classList.remove("isActive");
    $modal.querySelectorAll(".estadisticas span").forEach((e) => {
      e.classList.remove("opacity");
    });
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
