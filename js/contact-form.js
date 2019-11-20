/**
 * @param {String} url
 * @param {String} path
 * @param {{method:'GET'|'POST'|'PUT'|'DELETE',token:String,data:Object}}opt
 */
async function fetchBase(url, path, opt) {
  const { method, token, data } = {
    method: 'GET',
    data: {},
    token: '',
    ...opt,
  }

  const query = {
    method: method, // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
  }

  if (token) {
    query.headers.Authorization = 'Bearer ' + token
  }
  if (method !== 'GET' && data) {
    query.body = JSON.stringify(data)
  }

  const uri = path ? new URL(url, path).href : url
  console.log(
    `%c${method} %c${uri}`,
    'color:#f41; font-weight:bold',
    'font-weight:bold'
  )
  const response = await fetch(uri, query)

  return Promise.all([response.status, response.json()])
}

function serialize(form) {
  if (!form || form.nodeName !== 'FORM') {
    return
  }
  var i,
    j,
    obj = {}
  for (i = form.elements.length - 1; i >= 0; i = i - 1) {
    if (form.elements[i].name === '') {
      continue
    }
    switch (form.elements[i].nodeName) {
      case 'INPUT':
        switch (form.elements[i].type) {
          case 'text':
          case 'email':
          case 'hidden':
          case 'password':
          case 'button':
          case 'reset':
          case 'submit':
            obj[form.elements[i].name] = form.elements[i].value
            break
          case 'checkbox':
          case 'radio':
            if (form.elements[i].checked) {
              obj[form.elements[i].name] = form.elements[i].value
            }
            break
          case 'file':
            break
        }
        break
      case 'TEXTAREA':
        obj[form.elements[i].name] = form.elements[i].value
        break
      case 'SELECT':
        switch (form.elements[i].type) {
          case 'select-one':
            obj[form.elements[i].name] = form.elements[i].value
            break
          case 'select-multiple':
            for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
              if (form.elements[i].options[j].selected) {
                obj[form.elements[i].name] = form.elements[i].options[j].value
              }
            }
            break
        }
        break
      case 'BUTTON':
        switch (form.elements[i].type) {
          case 'reset':
          case 'submit':
          case 'button':
            obj[form.elements[i].name] = form.elements[i].value
            break
        }
        break
    }
  }
  return obj
}

const form = document.getElementById('email-form')
const formWaiting = document.getElementById('email-form-waiting')
const formFail = document.getElementById('email-form-fail')
const formSuccess = document.getElementById('email-form-success')

form.addEventListener('submit', function(ev) {
  formWaiting.style.display = 'block'
  fetchBase(form.action, '', {
    method: 'POST',
    data: serialize(form),
  })
    .then(([status, data]) => {
      formWaiting.style.display = 'none'
      if (status === 200 && data.status === 'success') {
        formSuccess.style.display = 'block'
      } else {
        console.error(status, data)
        formFail.style.display = 'block'
      }
    })
    .catch(err => {
      formWaiting.style.display = 'none'
      console.error(err)
      formFail.style.display = 'block'
    })
  ev.preventDefault()
  return false
})
