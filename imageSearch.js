var imageId = null;
var picture = null;


document.getElementsByTagName('button')[0].addEventListener('click', () => {
  getImage(document.getElementsByTagName('input')[0].value);
})

var getImage = (description) => {
  fetch(`https://images-api.nasa.gov/search?q=${description}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        return response.json().then((data) => {
          let error = new Error(response.status);
          error.response = data;
          error.status = response.status;
          throw error;
        })
      }
    })
    .then((images) => {
      imageId = findNasaId(images);
      return imageId;
    })
    .then((result) => {
      return fetch(`https://images-api.nasa.gov/asset/${result}`)
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        return response.json()
          .then((data) => {
            let error = new Error(response.status);
            error.response = data;
            error.status = response.status;
            throw error;
          })
      }
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
  var pics = pic.collection.items;
  for (var i = 0; i < pics.length; i++) {
    var item = pics[i].href
    if (item.endsWith('.jpg')) {
      return item;
    }
  }
}

function findNasaId(result) {
  var array = result.collection.items
  for (var i = 0; i < array.length; i++) {
    var item = array[i].data[0].nasa_id
    if (item[item.length - 1] !== ' ' && !isNaN(item[item.length - 1])) {
      return item;
    }
  }
}

