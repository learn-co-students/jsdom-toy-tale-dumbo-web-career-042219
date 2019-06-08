document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  let addToy = false

  const newToyForm = document.querySelector('.add-toy-form')
  // YOUR CODE HERE
  const star = {
    true:"★",
    false:"☆"
  }

  let starColor = {
    true:"gold",
    false:""
  }
  const url = "http://localhost:3000/toys"
  const toyCollection = document.querySelector("#toy-collection")


////////////////////////------------ Create ------------////////////////////////


  // Create Toy Card or HTML for the toy card
  const createToyHTML = (toy) => {
    return `
      <div class="card" data-id="${toy.id}">
      <div class="star-btn"> ${star[toy.star]} </div>
        <h2> ${toy.name} </h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p data-likes="${toy.likes}">${toy.likes} Likes </p>
        <button class="like-btn"> Like ❤️ </button>
        <button class="dislike-btn"> Dislike 💔</button>
        <button class="delete-btn">Delete 🗑</button>
      </div>`
  }

  // Populate the DOM with Database

  fetch(url)
  .then(resp => resp.json())
  .then(toyList => {
    toyList.forEach(toy => {
      toyCollection.innerHTML += createToyHTML(toy)
    })
  })
  // Add event
  newToyForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let emptyStar = star[false]
  // POST new toy to API
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: event.target.name.value,
        image: event.target.image.value,
        likes: 0,
        star: emptyStar
      })
    })
    // Convert Promise to JSON, or Javascript readable notation
    .then(resp => resp.json())
    // With the JSON, add the new toy card to the toy collection DIV in the DOM
    .then(toy => {
      // 1. To prepend the new toy
      // toyCollection.innerHTML = createToyHTML(toy) + toyCollection.innerHTML
      // 2. To append the new toy
      toyCollection.innerHTML += createToyHTML(toy)
    })
    newToyForm.reset()
  })


////////////////////////------------ Update ------------////////////////////////


  // Patch a specfic toy card
  // 1. Get the Outermost Parent
  let parentDiv = document.querySelector("#toy-collection")
  // 2. Add event listener to the this parent so that whenever you click something
  // inside it, an event is triggered
  parentDiv.addEventListener("click", e => {
////////////////////////------------ Like Button ------------////////////////////////
    // 3. Set a condition to check that what you clicked was the LIKE button
    if(e.target.className === "like-btn"){
      // 4. Gets number of updated likes, which you will need to put into our API/server
      const pTag = e.target.parentElement.querySelector("p")
      let updatedLikes = parseInt(pTag.dataset.likes) + 1
      // 5. Update the API with new number of likes
      // fetch will return a promise
      fetch(`${url}/${e.target.parentElement.dataset.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        // **Note** Whenever you set the body in a POST, PATCH, or PUT, stringify it to convert
        // JSON to string so that our API/server knows what datatype our keys should be
        body: JSON.stringify({ likes: updatedLikes })
      })
      // Set whatever name you want this promise to be and then use .json() to "resolve" it
      .then(response => response.json())
      // Set whatever name you want the resolved promise to be
      // This resolved promise can now be used to manipulate the DOM
      .then(updatedToy => {
        // Update the DOM to reflect the new number of likes for the toy
        pTag.dataset.likes = updatedToy.likes
        pTag.innerText = `${updatedToy.likes} Likes`
      })

////////////////////----------- Deliverables Met --------------////////////////////

////////////////////////------------ Delete ------------////////////////////////
    } else if (e.target.className === "delete-btn") {
      // Remove from API
      fetch(`${url}/${e.target.parentElement.dataset.id}`, { method: 'DELETE' })
      // Remove from DOM
      e.target.parentElement.remove()

////////////////////////------------ Star Button ------------////////////////////////
    } else if(e.target.className === "star-btn") {
      // *****Tried to persist new star in API
      if(e.target.innerText === "☆") {
        fetch(`${url}/${e.target.parentElement.dataset.id}`, {
          method: "PATCH",
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({ star: true })
        })
        .then(resp => resp.json())
        .then(updatedToy => {
          // debugger
          e.target.innerText = star[updatedToy.star]
          e.target.style.color = starColor[true]
        })
      } else {
        fetch(`${url}/${e.target.parentElement.dataset.id}`, {
          method: "PATCH",
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({ star: false })
        })
        .then(resp => resp.json())
        .then(updatedToy => {
          e.target.innerText = star[updatedToy.star]
          e.target.style.color = starColor[false]
        })
      }

////////////////////////------------ Dislike Button ------------////////////////////////
    } else if (e.target.className === "dislike-btn") {
      let pTag = e.target.parentElement.querySelector("p")
      let updatedLikes = pTag.dataset.likes - 1

      fetch(`${url}/${e.target.parentElement.dataset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ likes: updatedLikes})
      })
      .then(resp => resp.json())
      .then(updatedToy => {
        pTag.dataset.likes = updatedToy.likes
        pTag.innerText = `${updatedToy.likes} Likes`
      })
    }
  })
  // Toggle for the new toy form
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

})
