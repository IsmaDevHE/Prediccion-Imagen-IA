// MODELO predice -> si es polera, pantalon, poleron, gorro, zapatilla o etc.
// En base a ese resultado vamos a buscar los primeros links a amason que coincidan con el tipo de prenda

/* 
window.addEventListener('DOMContentLoaded', () => {
    const fileInput    = document.getElementById('file-input');
    const previewImage = document.getElementById('preview-image');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                const containerPreview = document.querySelector('.container-preview');
                containerPreview.innerHTML = `
                    <img id="preview-image" src="${event.target.result}" alt="Vista previa de la imagen">
                `
            });

            reader.readAsDataURL(file);
        } else {
            previewImage.setAttribute('src', '#');
        }
    });
}); */


// Función para cargar y utilizar el modelo
async function predictImage(file) {
  // Cargar el modelo desde la URL
  const model = await tf.loadLayersModel('modelo/model.json');
  const modelConfig = model;
  //const classLabels = modelConfig.classNames;
  console.log("Modelo Cargado");
  console.log(modelConfig);

  // Leer la imagen seleccionada
  const img    = new Image();
  const reader = new FileReader();

  reader.onload = function(e) {
    img.src = e.target.result;
    img.onload = async function(){
      // Preprocesar la imagen (ajustar el tamaño y normalizar los valores)
      const processedImg = preprocessImage(img);

      // Realizar la predicción
      const prediction = model.predict(processedImg);

      // Obtener los resultados de la predicción
      const predictionData = await prediction.data();

      // Obtener el índice de la clase con mayor probabilidad
      const predictedClassIndex = tf.argMax(predictionData).dataSync()[0];

      // Mostrar el resultado
      console.log('Clase predicha:', predictedClassIndex);
      	
      const data = getProductByName('')

      // Insertamos la data en el html
      // InsertDatainHTML()

    };
  };
  reader.readAsDataURL(file)
}


// Función para preprocesar la imagen (ajustar tamaño, convertir a escala de grises y normalizar valores)
function preprocessImage(image) {
  // Redimensionar la imagen a 28x28 píxeles
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 28;
  canvas.height = 28;
  context.drawImage(image, 0, 0, 28, 28);

  // Obtener los datos de píxeles de la imagen redimensionada
  const imageData = context.getImageData(0, 0, 28, 28);
  const data = imageData.data;

  // Convertir la imagen a escala de grises
  const grayData = new Uint8ClampedArray(28 * 28);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calcular el valor de escala de grises utilizando la fórmula de luminosidad
    const gray = Math.round(0.2989 * r + 0.587 * g + 0.114 * b);

    // Asignar el valor de escala de grises al canal correspondiente
    const index = i / 4;
    grayData[index] = gray;
  }

  // Crear un tensor a partir de los datos de escala de grises
  const tensor = tf.tensor4d(grayData, [1, 28, 28, 1]);

  // Cambiar el formato de la imagen para que coincida con el formato de entrada del modelo
  const reshapedImage = tensor;

  // Normalizar los valores de píxeles entre 0 y 1
  const normalizedImage = reshapedImage.div(255);

  return normalizedImage;
}



// Manejar el evento de cambio de archivo
document.getElementById('file-input').addEventListener('change', function(event) {
  // Obtener el archivo seleccionado
  const file = event.target.files[0];
  console.log(file)
  if (file) {
    const containerPreview = document.querySelector('.container-preview');
        containerPreview.innerHTML = `
            <img id="preview-image" src="../IMAGES/Test/${file.name}" alt="Vista previa de la imagen">
        `
        
    // Predecir la imagen
    predictImage(file);
  };
});

// Funcion para obtener los productos de amason
async function getProductByName(name){
  // Consultamos al json
  //const product = await 
  // Filtramos solo aquellos que en sus nombres tengan caracteres que coincidan con el nombre que predice el modelo

  return 'productFiltered';
} 


function InsertDatainHTML(data){
  // Se hace todo el proceso de nsertar los datos en el DOM
}