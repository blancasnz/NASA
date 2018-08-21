var imageId = null;
var picture = null;


document.getElementsByTagName('button')[0].addEventListener('click', () => {
  getImage(document.getElementsByTagName('input')[0].value);
})

var getImage = (description) => {
  fetch(`https://images-api.nasa.gov/search?q=${description}`)
    .then((response) => {
      return response.json();
    })
    .then((images) => {
      imageId = findNasaId(images);
      return imageId
    })
    .then((result) => {
      return fetch(`https://images-api.nasa.gov/asset/${result}`)
    })
    .then((response) => {
      return response.json();
    })
    .then((pic) => {
      picture = findPic(pic);
      fillInProfile();
    })
}

function fillInProfile() {
  document.getElementById('picture').src = picture;
}

function findPic(pic) {
  var items = pic.collection.items;
  for (var i = 0; i < items.length; i++) {
    var item = items[i].href
    if (item.endsWith('.jpg')) {
      return item;
    }
  }
}

function findNasaId(result) {
  var array = result.collection.items
  for (var i = 0; i < array.length; i++) {
    var item = array[i].data[0].nasa_id
    if (item.length < 10) {
      return item;
    }
  }
}

