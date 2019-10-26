console.log('hola mundo!');
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

const getUser1 = new Promise(function(todoBien, todoMal) {
  // llama un api
  setTimeout(function(){
    // Ejecuta cuando pasa el tiempo
    todoBien('funcion todoMal es la misma funcion anonima que esta de parametro del .catch');
  }, 5000)
});
const getUser2 = new Promise(function(todoBien, todoMal) {
  // llama un api
  setTimeout(function(){
    // Ejecuta cuando pasa el tiempo
    todoBien('2funcion todoMal es la misma funcion anonima que esta de parametro del .catch');
  }, 3000)
});

// getUser
//   .then(function(){
//     console.log('Todo esta bien en la vida');
//   })
//   .catch(function(message){
//     console.log(message);
//   })

Promise.race([
  getUser1,
  getUser2,
])
.then((message) => {
  console.log(message);
})
.catch((message) => {
  console.log(message);
});



// $.ajax('https://randomuser.me/api/', {
//   method: 'GET',
//   success: (data) => {
//     console.log(data)
//   },
//   error: (error) => {
//     console.log(error)
//   }
// })


// fetch('https://randomuser.me/api/',)
//   .then((response) => {
//     // console.log(response)
//      return response.json()
//   })
//   .then((user) => {
//     console.log('user', user.results[0].name.first)
//   })
//   .catch((error) => {
//     console.log(error)
//   });

(async function load() {

  const API = 'https://yts.lt/api/v2/';
  
  // const response = await fetch('https://yts.lt/api/v2/list_movies.json?genre=action');
  // const data = await response.json();
  // console.log(data);

  const getData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const actionList = await getData(`${API}list_movies.json?genre=action`);
  const dramaList = await getData(`${API}list_movies.json?genre=drama`);
  const animationList = await getData(`${API}list_movies.json?genre=animation`);
  console.log(actionList, dramaList, animationList);

  const videoItemTemplate = (movie) => {
    return(
      `
      <div class="primaryPlaylistItem">
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>
      `
    )    
  };

  const createTemplate = (HTMLString) => {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString
    return html.body.children[0];
  };

  const renderMovieList = (list, $container) => {
    // actionList.data.movies es el parametro liste que se le pasa a la funcion
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLToString = videoItemTemplate(movie);
      const movieElement = createTemplate(HTMLToString);
      $container.append(movieElement);
    });
  };

  const $actionContainer = document.getElementById('action');
  renderMovieList(actionList.data.movies, $actionContainer);

  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList.data.movies, $dramaContainer);

  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList.data.movies, $animationContainer);
  
  const $featuringContainer = document.getElementById('featuring');
  const $form = document.getElementById('form');
  const $home = document.getElementById('home');

  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');
  
  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalIDescription = $modal.querySelector('p');

})();