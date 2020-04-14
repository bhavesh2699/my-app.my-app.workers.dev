const COOKIES = '__url'
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

  let fetchURL_Get
  const __url_cookie = getCookie(request, COOKIES)
  if (__url_cookie) {
    fetchURL_Get = __url_cookie
  } else {
    fetchURL_Get = await getFetchURL()

    var date = new Date()
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    var biscuit = `${COOKIES}=${fetchURL_Get}; Expires=${date.toGMTString()}`
  }

  let data = await fetchURL(fetchURL_Get)
  let response = new Response(data, {
    headers: { 'content-type': 'text/html' },
  })

  let transformedData = await transformHTML(response)

  if (__url_cookie == null) {
    transformedData.headers.set('Set-Cookie', biscuit)
  }

  return transformedData
}

async function fetchURL(url) {

  let response = await fetch(url)
  return response.text()
}


async function getFetchURL() {

  var JSONURL = 'https://cfw-takehome.developers.workers.dev/api/variants'
  let response = await fetch(JSONURL)
  let data = await response.json()
  var array=[]
 //array.push(response[Object.keys(response)[0]]);
 array.push(data.variants[0])
 array.push(data.variants[1])
 var randomUrl=Math.floor(Math.random()*array.length)
  return randomUrl }

  function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}




class Title {
  element(element) {
    element.setInnerContent('I\'am Bhavesh Solanki')
  }
}



class Link {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace('https://cloudflare.com', 'https://bhavesh2699.github.io/')
      )
    }
    element.setInnerContent('Go to my website...')
  }
}

async function transformHTML(data) {

  const rewriter = new HTMLRewriter()
    .on('title', new Title())
    .on('h1#title', new Title())
    .on('a#url', new Link('href'))
  return rewriter.transform(data)
}


