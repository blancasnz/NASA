var imageId = null;
var picture = null;

var fillPage = () => {
  for (var i = 0; i < localStorage.length; i++) {
    var photo = localStorage.getItem(localStorage.key(i));
    console.log(localStorage);

    //create li tag with class searched
    var item = document.createElement('div');
    var att = document.createAttribute('class');
    att.value = 'searched';
    item.setAttributeNode(att);

    //create img tag with class archived Item and attribute src
    var img = document.createElement('img');
    var att2 = document.createAttribute('class');
    var att3 = document.createAttribute('src');
    att2.value = 'archivedImage';
    att3.value = photo;
    img.setAttributeNode(att2);
    img.setAttributeNode(att3);

    //appending img to item
    item.appendChild(img);

    //appending list item to unordered list
    document.getElementById('archive').appendChild(item);
  }
}

if (localStorage) {
  fillPage();
}

var fillInProfile = () => {
  document.getElementById('picture').src = picture;
}

var findPic = (pic) => {
  var pics = pic.collection.items;
  for (var i = 0; i < pics.length; i++) {
    var item = pics[i].href
    if (item.endsWith('.jpg')) {
      return item;
    }
  }
}

var findNasaId = (result) => {
  var array = result.collection.items
  for (var i = 0; i < array.length; i++) {
    var item = array[i].data[0].nasa_id
    if (item[item.length - 1] !== ' ' && !isNaN(item[item.length - 1])) {
      return item;
    }
  }
}

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

document.getElementsByTagName('button')[0].addEventListener('click', () => {
  var entered = document.getElementsByTagName('input')[0].value;
  getImage(entered);
  window.localStorage.setItem(entered, picture);
})
