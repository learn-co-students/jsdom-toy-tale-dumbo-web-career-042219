const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const newToyForm = document.querySelector('.add-toy-form')
const toyCollection = document.querySelector('#toy-collection')
const nameInput = document.querySelector('name-input')
const imagInput = document.querySelector('image-input')
const likeButton = document.querySelector('.like-btn')
const deleteButton = document.querySelector('.del-btn')
const url = 'http://localhost:3000/toys'
let addToy = false

////////////////////////////Fetch List of current toys///////////////////////

const fetchToys = () => {
  fetch(url)
   .then(res => res.json())
   .then(data => {
     data.forEach(toy => {
     toyCollection.innerHTML += renderToyCard(toy) /////////////Render Toys on Page
    })
  })
}
fetchToys() ////makes the toy variable available to renderToyCard
////////////////////////////Create toycard/ HTML///////////////////////
const renderToyCard = (toy) => {
  return `
    <div class="card" data-id= "${toy.id}">
      <button class="del-btn" style = "background: white;">🗑</button>
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p data-likes = "${toy.likes} class = "toy-likes'>${toy.likes} Likes </p>
      <button class="like-btn">Like <3</button>
    </div>
  `
}
////////////////////////////Submit NewToyForm///////////////////////
newToyForm.addEventListener('submit', (event) => {
  event.preventDefault()
    //Post form entry to API
    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        name: event.target.name.value,
        image: event.target.image.value,
        likes: 0
      })
    }) //returns a promise to povide something
    .then(res => res.json())
    .then(data => {
      toyCollection.insertAdjacentHTML('afterbegin', renderToyCard(data))
    })
    newToyForm.reset()
})
///////////////////////////////Click to open or hide the toyForm//////////////////////
addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

////////////////////////////Add new likes, Delete Toy///////////////////////
toyCollection.addEventListener('click', (event) => {
  const buttonTag = event.target

  console.log(buttonTag.className)
  let toyId = event.target.parentElement.dataset.id

  const pTag = buttonTag.parentElement.querySelector('p')
  const likesText = pTag.innerText
  if (event.target.className === "like-btn") {
    let updatedLikes = parseInt(likesText)
    updatedLikes++
    fetch(`${url}/${toyId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ 'likes': updatedLikes})
        })
      .then(res => res.json())
      .then(toydata => {
        pTag.innerHTML = `${toydata.likes} Likes`
      })
  }
  else if (event.target.className == 'del-btn') {
    console.log(buttonTag.className)
    fetch(`${url}/${toyId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(toydata => {
        event.target.parentElement.remove()
      })
  }
})
