var imageId = null;
var picture = null;


var updatePage = (image) => {
  var item = document.createElement('div');
  var att = document.createAttribute('class');
  att.value = 'searched';
  item.setAttributeNode(att);

  var img = document.createElement('img');
  var att2 = document.createAttribute('class');
  var att3 = document.createAttribute('src');
  att2.value = 'archivedImage';
  att3.value = image;
  img.setAttributeNode(att2);
  img.setAttributeNode(att3);

  item.appendChild(img);

  document.getElementById('archive').appendChild(item);
}


var fillPage = () => {
  for (var i = 0; i < localStorage.length; i++) {
    var photo = localStorage.getItem(localStorage.key(i));
    updatePage(photo);
  }
}

if (localStorage) {
  fillPage();
}

var fillInProfile = () => {
  document.getElementById('picture').src = picture;
  // var image = document.createElement('img');
  // var att = document.createAttribute('id');
  // var att2 = document.createAttribute('src');
  // att.value = 'foundPicture';
  // att2.value = picture;
  // image.setAttributeNode(att);
  // image.setAttributeNode(att2);

  // var main = document.getElementsByClassName('image')[0];
  // // var oldImage;
  // var childExists = false;


  // if (childExists) {
  //   main.innerHTML = '';
  //   main.appendChild(image);
  //   // oldImage = image;
  // } else {
  //   main.appendChild(image);
  //   childExists = true;
  //   // oldImage = image;
  // }

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
      window.localStorage.setItem(description, picture);
      fillInProfile();
      updatePage(picture);
    })
}

document.getElementById('submit').addEventListener('click', () => {
  var entered = document.getElementsByTagName('input')[0].value;
  getImage(entered);
  document.getElementById('input').value = '';
})
