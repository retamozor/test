const estado = document.getElementById('estado');
const cedula = document.getElementById('usrCedula')
const form = document.getElementById('update');

form.onsubmit = async e => {
  e.preventDefault();
  let est = JSON.stringify({estado:estado.value, cedula: cedula.textContent.slice(5)});
  const res = await fetch('/API/user-data',{
    method: 'PUT',
    body: est,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const json = await res.json();
  if (json.ok) alert('actualizado correctamente')
  else {
    alert(json.error.detail)
    if (json.error.code == -1) window.location.replace("/");
  }
  console.log(json.error.detail);
}