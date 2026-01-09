// =======================
// app.js - Lógica de frontend para gestión de estudiantes, carreras y categorías
// Este archivo contiene los servicios para consumir la API REST y los manejadores de eventos
// para registrar, buscar y eliminar estudiantes, carreras y categorías.
// =======================

const API_STUDENT_URL = "http://localhost:5001/api/students";
const API_CAREERS_URL = 'http://localhost:5001/api/careers'
const API_CATEGORIES_URL = 'http://localhost:5001/api/categories'

const API_KEY = "12345ABCDEF";

// Headers comunes para todas las peticiones
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};


// =======================
// Servicio: Registrar estudiante
// Recibe nombre y carrera, realiza POST a la API y retorna el resultado.
// =======================
// Funciones de servicio que retornan Promesas
async function registerStudentService(name, career) {
    const response = await fetch(API_STUDENT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, career })
    });
    return response.json();
}
// =======================
// Servicio: Buscar estudiante por ID
// Realiza GET a la API con el ID y retorna el estudiante encontrado o error.
// =======================
//funcion para buscar estudiantes por ID, este es el servicio
async function getStudentByIdService(id) {
    const response = await fetch(`${API_STUDENT_URL}/${id}`, {
        method: "GET",
        headers
    });
    return response.json();
}
// =======================
// Servicio: Buscar estudiantes por carrera
// Realiza GET a la API con el filtro de carrera y retorna los estudiantes.
// =======================
//funcion para buscar estudiantes por carrera, este es el servicio
async function getStudentsByCareerService(career) {
    const response = await fetch(`${API_STUDENT_URL}?career=${career}`, {
        method: "GET",
        headers
    });
    return response.json();
}
// =======================
// Servicio: Eliminar estudiante por ID
// Realiza DELETE a la API con el ID y retorna el resultado.
// =======================
//borrar estudiantes en el servicio
async function deleteStudentService(id) {
    const response = await fetch(`${API_STUDENT_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
}
// =======================
// Evento: Registrar estudiante desde el formulario
// Valida campos, llama al servicio y actualiza la tabla si es exitoso.
// =======================
// Funciones que manejan eventos de la interfaz

async function registerStudent() {
  const name = document.getElementById('registerName').value.trim();
  const career = document.getElementById('registerCareer').value.trim();
  // const age = document.getElementById('registerAge').value.trim();
  // const dni = document.getElementById('registerDni').value.trim();

  // Validación básica
  if (!name || !career) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Todos los campos son obligatorios"
    });
    return;
  }

  try {
    const result = await registerStudentService(name, career);
   
    // Verificar si el API devuelve un error
    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.error
      });
    } else {
      // Éxito: Mostrar SweetAlert y limpiar formulario
     Swal.fire({
  icon: "success",
  title: "¡Estudiante registrado!",
  text: "Estudiante registrado correctamente."
});

      // Limpiar campos
      document.getElementById('registerName').value = '';
      document.getElementById('registerCareer').value = '';
      // document.getElementById('registerAge').value = '';
      // document.getElementById('registerDni').value = '';

      // Opcional: Actualizar lista de estudiantes
      loadStudentsTable();// Si tienes una función para esto
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo registrar el estudiante"
    });
  }
}
// =======================
// Evento: Buscar estudiante por ID desde el formulario
// Valida campo, llama al servicio y muestra el resultado.
// =======================
//funcion traer estudiante por ID
async function getStudentById() {
  const id = document.getElementById('studentId').value.trim();

  if (!id) {
    Swal.fire({ icon: "error", title: "Error", text: "Ingrese un ID válido" });
    return;
  }

  try {
    const student = await getStudentByIdService(id);
    
    if (student.error) {
      Swal.fire({ icon: "error", title: "Error", text: student.error });
    } else {
      // Mostrar resultado en SweetAlert + en el pre
      Swal.fire({
        icon: "success",
        title: "Estudiante encontrado",
        html: `<b>Nombre:</b> ${student.name}<br><b>Carrera:</b> ${student.career}`
      });
      
      // Opcional: Mostrar también en el <pre>
      document.getElementById('getResult').textContent = JSON.stringify(student, null, 2);
    }
  } catch (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error al buscar estudiante" });
  }
}
// =======================
// Evento: Buscar estudiantes por carrera desde el formulario
// Valida campo, llama al servicio y muestra el resultado.
// =======================
//funcion traer estudiantes por carrera
async function getStudentsByCareer() {
  const career = document.getElementById('careerFilter').value.trim();

  if (!career) {
    Swal.fire({ icon: "error", title: "Error", text: "Ingrese una carrera" });
    return;
  }

  try {
    const students = await getStudentsByCareerService(career);
    
    if (students.length === 0) {
      Swal.fire({ icon: "info", title: "Info", text: "No hay estudiantes en esta carrera" });
    } else {
      Swal.fire({
        icon: "success",
        title: `${students.length} estudiantes encontrados`,
        text: `Carrera: ${career}`
      });
      
      // Mostrar en el <pre> (opcional)
      document.getElementById('careerResult').innerHTML = students.map(s => 
        `${s.name} (ID: ${s.id})`
      ).join('<br>');
    }
  } catch (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error al buscar" });
  }
}
// NOTA EDUCATIVA:
// Alternativa .map() para transformar un array en un nuevo array de resultados HTML.
// El método .map() es ideal cuando quieres "transformar" y "devolver" un nuevo array.
// Ejemplo:
// const htmlElements = students.map(student => `<div>${student.name}</div>`).join('');

// En cambio, .forEach() simplemente recorre el array y ejecuta una acción por cada elemento.
// Es más fácil de entende, porque no devuelve nada, solo "hace cosas".
// Aquí usamos forEach para ir creando y agregando manualmente los elementos al HTML.
// resultContainer.innerHTML = students.map(student => 
//     <div class="student-card">
//         <strong>ID:</strong> ${student.id}<br>
//         <strong>Name:</strong> ${student.name}<br>
//         <strong>Career:</strong> ${student.career}
//     </div>
// ).join('<hr>');


// =======================
// Evento: Eliminar estudiante por ID desde la tarjeta
// Valida campo, llama al servicio y actualiza la tabla si es exitoso.
// =======================
// Función para eliminar estudiante
async function deleteStudent() {
  const id = document.getElementById('deleteId').value.trim();

  if (!id) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor ingrese un ID válido",
    });
    return;
  }

  try {
    const result = await deleteStudentService(id);

    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.error
      });
      document.getElementById('deleteResult').textContent = result.error;
      return;
    }

    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "Estudiante eliminado correctamente"
    });
    document.getElementById('deleteResult').textContent = JSON.stringify(result, null, 2);

    // ACTUALIZA LA TABLA AUTOMÁTICAMENTE
    loadStudentsTable()

  } catch (error) {
    console.error("Error deleting student:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el estudiante"
    });
    document.getElementById('deleteResult').textContent = "error al eliminar estudiante";
  }
}
// =======================
// Función: Cargar la tabla de estudiantes
// Obtiene todas las carreras, luego todos los estudiantes por carrera y llena la tabla.
// Inicializa DataTables si es necesario.
// =======================
// Función para cargar la tabla de estudiantes
 async function loadStudentsTable() {
  try {
    // 1. Obtén todas las carreras
    const careersResponse = await fetch(API_CAREERS_URL, { headers });
    const careers = await careersResponse.json();

    let allStudents = [];

    // 2. Por cada carrera, pide los estudiantes
    for (const career of careers) {
      const studentsResponse = await fetch(`${API_STUDENT_URL}?career=${encodeURIComponent(career.name)}`, { headers });
      const students = await studentsResponse.json();
      if (Array.isArray(students)) {
        allStudents = allStudents.concat(students);
      }
    }

    // 3. Llena la tabla
    const tbody = document.getElementById('tbody_students');
    if (!tbody) return;
    tbody.innerHTML = '';

    allStudents.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.career}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-danger" onclick="deleteStudentById(${student.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Inicializa DataTables solo si no está inicializada
    if (!$.fn.DataTable.isDataTable('#studentsTable')) {
      $('#studentsTable').DataTable();
    }
  } catch (error) {
    console.error('Error al cargar estudiantes:', error);
    Swal.fire('Error', 'No se pudieron cargar los estudiantes', 'error');
  }
}
// =======================
// Evento: Eliminar estudiante desde la tabla
// Llama al servicio y actualiza la tabla si es exitoso.
// =======================
async function deleteStudentById(id) {
  try {
    const result = await deleteStudentService(id);

    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.error
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "Estudiante eliminado correctamente"
    });

    loadStudentsTable(); // Actualiza la tabla después de borrar

  } catch (error) {
    console.error("Error al eliminar estudiante:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el estudiante"
    });
  }
}
// =======================
// Servicio: Registrar carrera
// Recibe el nombre de la carrera, realiza POST a la API y retorna el resultado.
// =======================
// Servicios para Carreras
async function registerCareerService(name) {
    const response = await fetch(API_CAREERS_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ name })
    });
    return response.json();
}
// =======================
// Servicio: Buscar carrera por ID
// Realiza GET a la API con el ID y retorna la carrera encontrada o error.
// =======================
async function getCareerByIdService(id) {
    const response = await fetch(`${API_CAREERS_URL}/${id}`, {
        method: "GET",
        headers
    });
    return response.json();
}
// =======================
// Servicio: Obtener todas las carreras
// Realiza GET a la API y retorna todas las carreras.
// =======================
async function getAllCareersService() {
    const response = await fetch(API_CAREERS_URL, {
        method: "GET",
        headers
    });
    return response.json();
}
// =======================
// Servicio: Eliminar carrera por ID
// Realiza DELETE a la API con el ID y retorna el resultado.
// =======================
async function deleteCareerService(id) {
    const response = await fetch(`${API_CAREERS_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
}
// =======================
// Evento: Registrar carrera desde el formulario
// Valida campo, llama al servicio y actualiza la tabla si es exitoso.
// =======================
// Manejadores de eventos para Carreras
async function registerCareer() {
    const name = document.getElementById('careerName').value.trim();
    
    if (!name) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor ingrese el nombre de la carrera"
        });
        return;
    }

    try {
        const result = await registerCareerService(name);
        
        if (result.error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: result.error
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Carrera registrada correctamente"
        });

        // Limpiar formulario y actualizar lista
        document.getElementById('careerName').value = '';
        loadCareersTable(); // Asegúrate de que esta función esté implementada
                            // para cargar la tabla de carreras actualizada despues de registrar una nueva carrera
    } catch (error) {
        console.error("Error al registrar carrera:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo registrar la carrera"
        });
    }
}
// =======================
// Evento: Buscar carrera por ID desde el formulario
// Valida campo, llama al servicio y muestra el resultado.
// =======================
// Función para buscar carrera por ID
async function getCareerById() {
    const id = document.getElementById('studentId').value.trim();
    
    if (!id) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor ingrese un ID válido"
        });
        return;
    }
  Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "ID registrado correctamente"
        });

    try {
        const career = await getCareerByIdService(id);
        const resultContainer = document.getElementById('getResult');
        
        if (career.error) {
            resultContainer.textContent = career.error;
        } else {
            resultContainer.innerHTML = `
                <strong>ID:</strong> ${career.id}<br>
                <strong>Nombre:</strong> ${career.name}
            `;
        }
    } catch (error) {
        console.error("Error al buscar carrera:", error);
        document.getElementById('getResult').textContent = "Error al buscar carrera";
    }
}
// =======================
// Evento: Eliminar carrera por ID desde la tarjeta
// Valida campo, llama al servicio y actualiza la tabla si es exitoso.
// =======================
// Función para eliminar carrera por ID
async function deleteCareer() {
    const id = document.getElementById('deleteId').value.trim();
    
    if (!id) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor ingrese un ID válido"
        });
        return;
    }


    try {
        const result = await deleteCareerService(id);
        
        if (result.error) {
            document.getElementById('deleteResult').textContent = result.error;
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Carrera eliminada correctamente"
        });

        // Limpiar campo y actualizar lista
        document.getElementById('deleteId').value = '';
        document.getElementById('deleteResult').textContent = '';
        // ACTUALIZA LA TABLA AUTOMÁTICAMENTE
        loadCareersTable();
        
    } catch (error) {
        console.error("Error al eliminar carrera:", error);
        document.getElementById('deleteResult').textContent = "Error al eliminar carrera";
    }
}
// =======================
// Función: Cargar la tabla de carreras
// Obtiene todas las carreras y llena la tabla. Inicializa DataTables si es necesario.
// =======================
// Función para cargar la tabla de carreras
async function loadCareersTable() {
  try {
    const careers = await getAllCareersService();
    const tbody = document.getElementById('tbody_careers');
    if (!tbody) return;

    tbody.innerHTML = ''; // Limpiar tabla

    careers.forEach(career => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${career.id}</td>
        <td>${career.name}</td>
        <td>${career.type || 'N/A'}</td>
        <td>${career.duration || 'N/A'}</td>
        <td>${career.category || 'N/A'}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteCareerById(${career.id})"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Inicializa DataTables solo si no está inicializada
    if (!$.fn.DataTable.isDataTable('#careersTable')) {
      $('#careersTable').DataTable();
    }
  } catch (error) {
    console.error("Error al cargar carreras:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar las carreras"
    });
  }
}
// =======================
// Evento: Eliminar carrera desde la tabla
// Llama al servicio y actualiza la tabla si es exitoso.
// =======================
// Función adicional para eliminar desde la tabla
async function deleteCareerById(id) {
    try {
        const result = await deleteCareerService(id);
        
        if (result.error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: result.error
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Carrera eliminada correctamente"
        });

        loadCareersTable();
        
    } catch (error) {
        console.error("Error al eliminar carrera:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la carrera"
        });
    }
}

// Inicialización cuando el DOM esté listo
// document.addEventListener('DOMContentLoaded', () => {
//     // Asignar eventos a los botones
//     document.querySelector('form').addEventListener('submit', (e) => {
//         e.preventDefault();
//         registerCareer();
//     });
    
//     document.querySelector('#getById button').addEventListener('click', getCareerById);
//     document.querySelector('#deleteId').nextElementSibling.querySelector('button').addEventListener('click', deleteCareer);
    
//     // Cargar la tabla al inicio
//     loadCareersTable();
// });

// =======================
// Servicio: Registrar categoría
// Recibe el nombre de la categoría, realiza POST a la API y retorna el resultado.
// =======================
// Servicios para Categorías
async function registerCategoryService(name) {
    const response = await fetch(API_CATEGORIES_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ name })
    });
    return response.json();
}
// =======================
// Servicio: Buscar categoría por ID
// Realiza GET a la API con el ID y retorna la categoría encontrada o error.
// =======================
async function getCategoryByIdService(id) {
    const response = await fetch(`${API_CATEGORIES_URL}/${id}`, {
        method: "GET",
        headers
    });
    return response.json();
}
// =======================
// Servicio: Obtener todas las categorías
// Realiza GET a la API y retorna todas las categorías.
// =======================
async function getAllCategoriesService() {
    const response = await fetch(API_CATEGORIES_URL, {
        method: "GET",
        headers
    });
    return response.json();
}
// =======================
// Servicio: Eliminar categoría por ID
// Realiza DELETE a la API con el ID y retorna el resultado.
// =======================
async function deleteCategoryService(id) {
    const response = await fetch(`${API_CATEGORIES_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
}

// Manejadores de eventos para Categorías

// =======================
// Evento: Registrar categoría desde el formulario
// Valida campo, llama al servicio y actualiza la tabla si es exitoso.
// =======================
// Registrar categoría (con más validaciones)
async function registerCategory(event) {
  event.preventDefault();
  const name = document.getElementById('categoryName').value.trim();

  if (!name) {
    await Swal.fire('Error', 'El campo nombre de categoría es obligatorio', 'error');
    return;
  }
  if (name.length < 3) {
    await Swal.fire('Error', 'Nombre muy corto (mín. 3 caracteres)', 'error');
    return;
  }

  try {
    const response = await fetch(API_CATEGORIES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ name })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Error en el servidor');

    await Swal.fire('¡Éxito!', 'Categoría registrada', 'success');
    document.getElementById('categoryName').value = '';
    loadCategoriesTable();

  } catch (error) {
    await Swal.fire('Error', error.message, 'error');
  }
}
// =======================
// Evento: Buscar categoría por ID desde el formulario
// Valida campo, llama al servicio y muestra el resultado.
// =======================
// Buscar categoría por ID
async function getCategoryById() {
    const id = document.getElementById('categoryId').value.trim();
    if (!id) {
        await Swal.fire({ icon: "error", title: "Error", text: "Ingrese un ID válido" });
        return;
    }
    try {
        const category = await getCategoryByIdService(id);
        const resultContainer = document.getElementById('categoryResult');
        if (category.error) {
            await Swal.fire({ icon: "error", title: "Error", text: category.error });
            resultContainer.textContent = category.error;
        } else {
            await Swal.fire({
                icon: "success",
                title: "Categoría encontrada",
                html: `<b>ID:</b> ${category.id}<br><b>Nombre:</b> ${category.name}`
            });
            resultContainer.innerHTML = `
                <strong>ID:</strong> ${category.id}<br>
                <strong>Nombre:</strong> ${category.name}
            `;
        }
    } catch (error) {
        await Swal.fire({ icon: "error", title: "Error", text: "Error al buscar categoría" });
        document.getElementById('categoryResult').textContent = "Error al buscar categoría";
    }
}
// =======================
// Evento: Eliminar categoría por ID desde la tarjeta
// Valida campo, llama al servicio y actualiza la tabla si es exitoso.
// =======================
// Eliminar categoría por ID
async function deleteCategory() {
    const id = document.getElementById('deleteCategoryId').value.trim();
    if (!id) {
        await Swal.fire({ icon: "error", title: "Error", text: "Ingrese un ID válido" });
        return;
    }
    try {
        const result = await deleteCategoryService(id);
        const resultContainer = document.getElementById('deleteCategoryResult');
        if (result.error) {
            await Swal.fire({ icon: "error", title: "Error", text: result.error });
            resultContainer.textContent = result.error;
        } else {
            await Swal.fire({ icon: "success", title: "¡Éxito!", text: "Categoría eliminada correctamente" });
            resultContainer.textContent = "Categoría eliminada correctamente";
            loadCategoriesTable(); // Actualiza la tabla
        }
    } catch (error) {
        await Swal.fire({ icon: "error", title: "Error", text: "Error al eliminar categoría" });
        document.getElementById('deleteCategoryResult').textContent = "Error al eliminar categoría";
    }
}
// =======================
// Función: Cargar la tabla de categorías
// Obtiene todas las categorías y llena la tabla. Inicializa DataTables si es necesario.
// =======================
async function loadCategoriesTable() {
  try {
    const response = await fetch(API_CATEGORIES_URL, { headers });
    const categories = await response.json();

    const tbody = document.getElementById("tbody_categories"); // Selector actualizado

    // Verifica si el elemento existe
    if (!tbody) {
      console.log('Error: No se encontró el elemento tbody');
      return;
    }

    tbody.innerHTML = ''; // Limpiar tabla (ahora seguro)

    categories.forEach(category => {
      const row = `
        <tr>
          <td>${category.id}</td>
          <td>${category.name}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-danger" onclick="deleteCategoryById(${category.id})">
           <i class="fas fa-trash-alt"></i>
          </button>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
    // Inicializa DataTables solo si no está inicializada
    if (!$.fn.DataTable.isDataTable('#categoriesTable')) {
      $('#categoriesTable').DataTable();
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
  }
}
// =======================
// Evento: Eliminar categoría desde la tabla
// Llama al servicio y actualiza la tabla si es exitoso.
// =======================
// Función para eliminar desde la tabla
async function deleteCategoryById(id) {
    try {
        const result = await deleteCategoryService(id);
        
        if (result.error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: result.error
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Categoría eliminada correctamente"
        });

        loadCategoriesTable();
        
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la categoría"
        });
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => { //event listener
    // --- Navbar activo ---
  const links = document.querySelectorAll('.navbar-nav .nav-link');
  let currentPage = location.pathname.split('/').pop();
  if (currentPage === "" || currentPage === "/") currentPage = "index.html";
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== "#" && (href === currentPage || location.pathname.endsWith(href))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  // --- Asignar evento al formulario de categorías ---
   const form = document.getElementById('categoryForm');
  if (form) form.addEventListener('submit', registerCategory);
  // --- Cargar la tabla de categorías al inicio ---
  loadCategoriesTable();
    // Cargar la tabla de carreras al inicio
     loadCareersTable();
     //cargar la tabla de categorias al inicio la que esta al final
      loadCategoriesTable();
      // Cargar la tabla de estudiantes al inicio
      loadStudentsTable();
    // Asignar evento al formulario
    // document.getElementById('categoryForm').addEventListener('submit', registerCategory);
    
    // Cargar la tabla al inicio
    // loadCategoriesTable();

    const init_careers = await getAllCareersService();

    const init_categories = await getAllCategoriesService();

    const select_carreras = document.getElementById('registerCareer');

    if(select_carreras){
        init_careers.forEach(career => {
            const option = document.createElement('option');

            option.value = career.name;
            option.textContent = career.name;

            select_carreras.appendChild(option)
        })
    }

    console.log('Carreras: ' , init_careers)
    console.log('Categorias: ', init_categories);

      
   const select_categories = document.getElementById('careerCategory')

   if (select_categories){
    init_categories.forEach(categories => {
        const option = document.createElement(`option`)

        option.value = categories.name;
        option.textContent = categories.name;

        select_categories.appendChild(option)
   })
    }
})

// =======================
// RESUMEN DEL FLUJO
// =======================
// - Los servicios (registerStudentService, getStudentByIdService, etc.) interactúan con la API REST.
// - Los eventos (registerStudent, deleteStudent, etc.) gestionan la interacción con el usuario y actualizan la UI.
// - Al cargar la página, se inicializan las tablas y los selectores.
// - Cada vez que se agrega, elimina o modifica un estudiante, carrera o categoría, la tabla correspondiente se recarga automáticamente para reflejar los cambios.