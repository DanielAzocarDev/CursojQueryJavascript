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
    if (data.data.movie_count > 0){
      return data;
    }
    throw new Error('No se encontró ningun resultado');

  };


  // console.log(actionList, dramaList, animationList);

  const videoItemTemplate = (movie, category) => {
    return(
      `
      <div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
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

  const addEventClick = (el)  => {
    el.addEventListener('click', () => {
      // alert('click');
      showModal(el);
    });
  };

  const renderMovieList = (list, $container, category) => {
    // actionList.data.movies es el parametro liste que se le pasa a la funcion
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLToString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLToString);
      $container.append(movieElement);
      const image = movieElement.querySelector('img');
      image.addEventListener('load', (event) => {
        event.srcElement.classList.add('fadeIn');        
      });

      addEventClick(movieElement);
    });
  };

  const { data: {movies: actionList}} = await getData(`${API}list_movies.json?genre=action`);
  localStorage.setItem('actionList', JSON.stringify(actionList));
  
  const $actionContainer = document.getElementById('action');
  renderMovieList(actionList, $actionContainer, 'action');
  
  const { data:{ movies: dramaList}} = await getData(`${API}list_movies.json?genre=drama`);
  localStorage.setItem('dramaList', JSON.stringify(dramaList));
  
  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');
  
  const {data: {movies: animationList}} = await getData(`${API}list_movies.json?genre=animation`);
  localStorage.setItem('animationList', JSON.stringify(animationList));

  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');

  const $home = document.getElementById('home');

  const $form = document.getElementById('form');

  const setAttributes = ($element, attributes) => {
    for(const attribute in attributes){
      $element.setAttribute(attribute, attributes[attribute]);
    }
  };
  
  const $featuringContainer = document.getElementById('featuring');
  const featuringTemplate = (peli) => {
    return (
      `
      <div class="featuring">
        <div class="featuring-image">
          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${peli.title}</p>
        </div>
      </div>
      `
    )
  };
  $form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    $home.classList.add('search-active');
    const $loader = document.createElement('img');
    setAttributes($loader,{
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    });
    $featuringContainer.append($loader);

    const data = new FormData($form);
    try {
      const {data: {movies: pelis}} = await getData(`${API}list_movies.json?limite=1&query_term=${data.get('name')}`)

      const HTMLString = featuringTemplate(pelis[0]);
      $featuringContainer.innerHTML = HTMLString;
    } catch (error) {
      alert(error.message);
      $loader.remove();
      $home.classList.remove('search-active');
    }
        
  });
    

  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');
  
  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalIDescription = $modal.querySelector('p');

  const findById = (list, id) => {
    return list.find(movie =>  movie.id == parseInt(id, 10))
  }

  const findMovie = (id, category) => {
    switch (category) {
      case 'action':
        return findById(actionList, id);
      case 'drama':
        return findById(dramaList, id);
    
      default:
        return findById(animationList, id);
    }
    
  }
  const showModal = (el) => {
    $overlay.classList.add('active');
    $modal.style.animation ='modalIn .8s forwards';
    const id = el.dataset.id;
    const category = el.dataset.category;

    const pelicula = findMovie(id, category);

    $modalTitle.textContent = pelicula.title;
    $modalImage.setAttribute('src', pelicula.medium_cover_image);
    $modalIDescription.textContent = pelicula.description_full;
  }

  const hideModal = () => {
    $modal.style.animation ='modalOut .6s forwards';
    setTimeout(() => {
      $overlay.classList.remove('active');
    }, 700);
  };

  $hideModal.addEventListener('click', hideModal);

})();