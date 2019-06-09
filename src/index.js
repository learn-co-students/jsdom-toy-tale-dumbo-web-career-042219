const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const addToyForm = document.querySelector('.add-toy-form')
const toyCollection = document.querySelector("#toy-collection")
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

let toyURL = 'http://localhost:3000/toys';

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM is loaded"); //

  //GET Toys
  fetch(toyURL)
  .then(function(res) {return res.json()})
  .then(data => data.forEach(domToy))

        //Toy Cards
        function domToy(toy) {
          const div = document.createElement("div")
            div.className = "card"
            div.innerHTML = `
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class="toy-avatar" />
            <p><span id="toy-${toy.id}-likes">${toy.likes}</span> Likes
            `
            // Create & Append Button for each Card
            const button = document.createElement("button")
            button.innerText = "Like ❤️"
            button.dataset.toyId = toy.id
            button.dataset.likes = toy.likes
            button.addEventListener("click", increaseLikes )
            div.appendChild(button)
            toyCollection.appendChild(div)
        console.log("domToy's Loaded"); //
        }

  // Likes PATCH & DOM Update
  function increaseLikes(event) {
    // which toy needs to be updated?
    const button = event.target
    const toyId = button.dataset.toyId

    const likesSpan = document.getElementById(`toy-${toyId}-likes`)
    const likes = parseInt(likesSpan.innerText)
    const newLikesTotal = likes + 1
    // console.log(likes);

    // fetch a PATCH for likes on the toy
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: newLikesTotal
      })
    }).then(function(response){
      return response.json()
    }).then(function(data){
        // update the DOM with new likes
      likesSpan.innerText = data.likes //
    })
    console.log(`Like button clicked for toyId:${toyId}`);
  }

  // Post New Toys

	addToyForm.addEventListener('submit', (e) => {
    let toyInfo = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
      }
		e.preventDefault()
    fetch(toyURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(toyInfo)
      })
      .then(res => res.json())
      .then(json => domToy(json));
			e.target.reset()
		})


});
