const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers/`
const POKEMONS_URL = `${BASE_URL}/pokemons/`
document.addEventListener('DOMContentLoaded', e => {
  const renderTrainers = (trainers) => {
    for (trainer of trainers) {
      renderTrainer(trainer)
    }
  }

  const renderTrainer = (trainer) => {
    const mainTag = document.querySelector('main')
    const trainerDiv = document.createElement('div')
    trainerDiv.classList.add('card')
    trainerDiv.setAttribute('data-id', `${trainer.id}`)
    trainerDiv.innerHTML = `
    <p>${trainer.name}</p>
    <button data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul></ul>
    `
    const pokeUl = trainerDiv.querySelector('ul')
    for (pokemon of trainer.pokemons) {
      const pokeLi = document.createElement('li')
      pokeLi.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>`
      pokeUl.append(pokeLi)
    }
    mainTag.append(trainerDiv)
  }

  const renderData = () => {
    fetch(TRAINERS_URL)
      .then(resp => resp.json())
      .then(renderTrainers)
  }

  const clickHandler = () => {
    document.addEventListener('click', e => {
      const button = e.target
      if (button.textContent == "Add Pokemon") {
        const trainerId = button.dataset.trainerId
        const teamSize = button.nextElementSibling.children.length
        if (teamSize < 6) {
          const options = {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "accept": "application/json"
            },
            body: JSON.stringify({ trainer_id: trainerId})
          }

          fetch(POKEMONS_URL, options)
            .then(resp => resp.json())
            .then(pokemon => {
              const trainerDiv = document.querySelector(`[data-id = "${pokemon.trainer_id}"]`)
              const pokeLi = document.createElement('li')
              pokeLi.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>`
              trainerDiv.querySelector('ul').append(pokeLi)
            })
        }
      } else if (button.textContent == "Release") {
        const pokemonId = button.dataset.pokemonId
        const options = {
          method:"DELETE"
        }
        fetch(POKEMONS_URL + pokemonId,options)
        .then(resp => resp.json())
        .then(pokemon =>{
          const pokeLi = document.querySelector(`[data-pokemon-id="${pokemon.id}"]`).parentElement
          pokeLi.remove()
        })
      }

    })
  }

  /*-----------------Section------------------*/

  renderData()
  clickHandler()
})
