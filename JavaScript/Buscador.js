// Buscador
export const buscador = async (buscador) => {
  const d = document,
    $template = d.getElementById("template").content,
    w = window,
    $sectionPokemon = d.querySelector(".container_pokemones"),
    $containerButtons = d.querySelector(".buttons"),
    fragmen = d.createDocumentFragment();

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

    console.log(res);
    if ($containerButtons.children) {
      let sons = Array.from($containerButtons.children);
      sons.forEach((e) => $containerButtons.removeChild(e));
    }
    $loader.classList.remove("block");
    $template.querySelector(".container_card_pokemon").dataset.id = res.name;
    $template.querySelector(".nombre").textContent = res.name;
    $template
      .querySelector(".img_pokemon")
      .setAttribute(
        "src",
        res.sprites.other["official-artwork"]["front_default"] === null
          ? `assets/images/question.svg`
          : `${res.sprites.other["official-artwork"]["front_default"]}`
      );
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
