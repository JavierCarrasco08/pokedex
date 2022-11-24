export const Pokedex = async (pokemones) => {
  const d = document,
    $template = d.getElementById("template").content,
    w = window,
    $sectionPokemon = d.querySelector(".container_pokemones"),
    $containerButtons = d.querySelector(".buttons"),
    fragmen = d.createDocumentFragment();
  let set;
  try {
    const $loader = d.querySelector(".loader");
    $loader.classList.add("block");

    let res = await fetch(pokemones),
      json = await res.json();
    if (!res.ok) throw res;
    if (!d.querySelector(".next")) {
      const $next = d.createElement("button");
      $next.classList.add("next");
      $next.textContent = "Next";
      $next.setAttribute("data-next", json.next);
      $containerButtons.appendChild($next);
    } else {
      $containerButtons
        .querySelector(".next")
        .setAttribute("data-next", json.next);
    }
    if (!json.next && $containerButtons.querySelector(".next")) {
      console.log("SI");
      let next = $containerButtons.querySelector(".next");
      $containerButtons.removeChild(next);
    }
    if (!json.previous && $containerButtons.querySelector(".prev")) {
      let prev = $containerButtons.querySelector(".prev");
      $containerButtons.removeChild(prev);
    }
    if (json.previous && !$containerButtons.querySelector(".prev")) {
      const $prev = d.createElement("button");
      $prev.classList.add("prev");
      $prev.textContent = "Previous";
      $prev.setAttribute("data-prev", json.previous);
      $containerButtons.insertAdjacentElement("afterbegin", $prev);
    }
    if ($containerButtons.querySelector(".prev")) {
      $containerButtons
        .querySelector(".prev")
        .setAttribute("data-prev", json.previous);
    }

    const arrayPokemones = json.results;
    console.log(arrayPokemones);
    for (let pokemon of arrayPokemones) {
      let poke = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      let reslt = await poke.json();
      // console.log(reslt);
      if (!poke.ok)
        throw {
          err: "No se puedo",
        };
      // VAn despues
      $template.querySelector(".container_card_pokemon").dataset.id =
        reslt.name;
      $template.querySelector(".nombre").textContent = reslt.name;
      $template
        .querySelector(".img_pokemon")
        .setAttribute(
          "src",
          reslt.sprites.other["official-artwork"]["front_default"] === null
            ? `${reslt.sprites.versions["generation-v"]["black-white"]["front_default"]}`
            : `${reslt.sprites.other["official-artwork"]["front_default"]}`
        );
      $template.querySelector(".img_pokemon").alt = reslt.name;
      let $clone = d.importNode($template, true);
      fragmen.appendChild($clone);
    }
    // let set = new Set();
    $sectionPokemon.appendChild(fragmen);

    $loader.classList.remove("block");
  } catch (err) {
    const $loader = d.querySelector(".loader");
    $loader.classList.remove("block");
    $template.querySelector(".nombre").textContent =
      "Lo sentimos este Pokemon aun no se encuentra!";
  }
};
