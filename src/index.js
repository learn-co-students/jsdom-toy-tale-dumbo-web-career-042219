const toyCollectionDiv = document.getElementById('toy-collection')
const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false

// YOUR CODE HERE
document.addEventListener("DOMContentLoaded", ()=> {
  const addToyToToyCollectionDiv = (toyObj, toyCollectionDiv) => {
    toyCollectionDiv.innerHTML = createToyCardHTML(toyObj) + toyCollectionDiv.innerHTML
  }
  // console.log(toyCollectionDiv)
  //Fetch Request for all toys
  fetch('http://localhost:3000/toys')
  .then((response) => response.json())
  .then((toyObjs) => {
    toyObjs.forEach(toy => {
      toyCollectionDiv.innerHTML += createToyCardHTML(toy)
    })
  })

//InnerHTML for the toy
const createToyCardHTML = (toy) => {
  return `<div class="card">
    <button class="delete-btn" style = "background-color: white; color: red;" >Delete 🗑</button>
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p data-like-count = "0">0 Likes </p>
    <button class="like-btn">Like 💟</button>
  </div>
  `
}

// Working with toyForm
// on submit, grab whatever is in the input box in the form
toyForm.addEventListener('submit', (event)=> {
  event.preventDefault()
  let newToyObj = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: event.target.likes
  }
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newToyObj)
  })
    .then(res => res.json())
    .then(toyObj=> {
      addToyToToyCollectionDiv(toyObj, toyCollectionDiv)
      document.querySelector('form').reset();
    })
})

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  // orginal code bellow
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})


//Get all of our buttons
document.addEventListener('click', event => {
  if(event.target.classList.value === 'like-btn') {
     // event.target.parentElement.remove()
     const buttonTag = event.target
     const pTag = buttonTag.parentElement.querySelector('p')
     let updatedLikeCount = parseInt(pTag.dataset.likeCount)
      console.log(updatedLikeCount)
      updatedLikeCount++
      pTag.dataset.likeCount = updatedLikeCount
      pTag.innerHTML = `${updatedLikeCount} Likes`
  } else if(event.target.classList.value === 'delete-btn') {
       event.target.parentElement.remove()
     }

})
  const createToy=(event, toyCollectionDiv, toyForm)=> {
    event.preventDefault()
    //POST to localhost:3000/toy
    let newToyObj = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: event.target.likes.value
    }
  fetch('http://localhost:3000/toys'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newToyObj)
  }.then(res => res.json())
  .then(toyObj=> {
    addToyToToyCollectionDiv(toyObj, toyCollectionDiv)
    form.reset()
    console.log(toyObj)
  })



}
})

// OR HERE!
