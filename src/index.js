const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false

// YOUR CODE HERE

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

const toyContainerDivTag = document.querySelector("#toy-collection")

const createToyHTML = (toy) => {
  return `
    <div class="card">
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" height="256" width="192"/>
      <p data-likes=${toy.likes}>${toy.likes} Likes </p>
      <button data-id=${toy.id} class="like-btn">Like <3</button>
    </div>
  `
}

fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(toys => {
    toys.forEach(toy => {
      toyContainerDivTag.innerHTML = createToyHTML(toy) + toyContainerDivTag.innerHTML
    })
  })

toyForm.addEventListener('submit', event => {
  event.preventDefault()
  const inputTextName = event.target.name.value
  const inputTextImage = event.target.image.value

  fetch('http://localhost:3000/toys/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: inputTextName,
        image: inputTextImage,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(toy => {
      toyContainerDivTag.innerHTML = createToyHTML(toy) + toyContainerDivTag.innerHTML
    })
})

toyContainerDivTag.addEventListener('click', event => {
  if (event.target.classList.contains("like-btn")) {
    const buttonTag = event.target
    const toyId = buttonTag.dataset.id
    const likeTag = buttonTag.parentElement.querySelector('p')
    const newLikeCount = parseInt(likeTag.dataset.likes) + 1

    fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          likes: newLikeCount
        })
      })
      .then(response => response.json())
      .then(toy => {
        likeTag.dataset.likes = toy.likes
        likeTag.innerText = `${toy.likes} Likes`
      })
  }
})

// OR HERE!
