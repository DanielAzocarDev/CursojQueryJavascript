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