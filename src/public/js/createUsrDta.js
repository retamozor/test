const dpto_nto = document.getElementById('departamento_nacimiento')
const dpto_exp = document.getElementById('departamento_expedicion')
const form = document.getElementById('form')

const dptoOnChange = async e => {
  const dpto = e.srcElement
  const ciudad = dpto.nextElementSibling

  const defaultOpt = ciudad.children[0]
  ciudad.innerText = '';
  ciudad.appendChild(defaultOpt);
  
  const url = `/API/ciudad-por-dpto?departamento=${dpto.value }`
  const response = await fetch(url)

  const ciudades = await response.json()

  ciudades.forEach(city => {
    var opt = document.createElement('option');
    opt.value = city.id;
    opt.innerHTML = city.nombre;
    ciudad.appendChild(opt);
  });
}

const preventSubmit = e => {
  e.preventDefault();
  new FormData(e.srcElement)
}

const createUserData = async e => {
  let data = e.formData

  let object = {};
  data.forEach((value, key) => object[key] = value);
  let json = JSON.stringify(object);

  let res = await fetch('/API/user-data', {
    method: 'POST',
    body: json,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  let msg = await res.json();
  console.log(msg.error);

  if (msg.ok) {
    alert('Se han creado los datos de usuario')
    location.reload()
  }
  else {
    if (msg.error.code == '23505') {
      alert(`ya existe el usuario con cedula ${object.cedula}`)
    }else{
      alert(msg.error.detail)
      if (msg.error.code = -1) window.location.replace("/");
    }
  }
}

dpto_nto.onchange = dptoOnChange;
dpto_exp.onchange = dptoOnChange;
form.onsubmit = preventSubmit;
form.onformdata = createUserData;
