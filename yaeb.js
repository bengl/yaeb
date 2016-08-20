require('mousetrap')
require('mousetrap/plugins/global-bind/mousetrap-global-bind')

const remote = require('electron').remote
let urlBar
global.yaeb = {
  profile: process.env.YAEB_PROFILE || 'default',
  newTabUrl: 'https://www.google.com'
}

let focusedView = -1
Mousetrap.bind('alt+b', () => currentView().goBack())
Mousetrap.bind('alt+n', () => currentView().goForward())
Mousetrap.bind('alt+r', () => currentView().reload())
Mousetrap.bind('alt+s', () => stop())
Mousetrap.bind('alt+t', () => newTab())
Mousetrap.bind('alt+q', closeTab)
Mousetrap.bind('alt+left', () => goTab(-1))
Mousetrap.bind('alt+right', () => goTab(1))
Mousetrap.bindGlobal('alt+u', toggleUrlBar)

function goTab(to) {
  const n = focusedView + to > views().length - 1 ?
            0 :
            focusedView + to < 0 ?
            views().length - 1 :
            focusedView + to

  focusView(n)
}

function currentView () {
  return views(focusedView)
}

function stop() {
  currentView().stop()
}

function views(n) {
  const views = document.getElementsByTagName('webview')
  return typeof n === 'number' ? views[n] : views
}

function tabs(n) {
  const tabs = document.getElementById('tabs').children
  return typeof n === 'number' ? tabs[n] : tabs
}

function focusView(n) {
  if (focusedView > -1) currentView().style.display = 'none'
  views(n).style.display = 'flex'
  if (tabs(n)) {
    Array.from(tabs()).forEach((t, i) => {
      if (i !== n) t.classList.remove('focused-tab')
      else t.classList.add('focused-tab')
    })
  }
  focusedView = n
}

function addTabToBar(n, view) {
  const title = '[Loading...]'
  const tabButton = document.createElement('div')
  tabButton.innerText = title
  tabButton.classList.add('tab')
  tabButton.classList.add(`profile-${yaeb.profile}`)
  document.getElementById('tabs').appendChild(tabButton)

  view.addEventListener('page-title-updated', (title) => {
    tabButton.innerText = view.getTitle()
  })
  view.addEventListener('will-navigate', (url) => {
    if (n !== focusedView) return
    urlBar.value = view.getURL()
  })
  view.addEventListener('did-navigate-in-page', (url) => {
    if (n !== focusedView) return
    urlBar.value = view.getURL()
  })
  view.addEventListener('did-start-loading', () => {
    tabButton.innerText = '[Loading...]'
  })
  view.addEventListener('did-stop-loading', () => {
    tabButton.innerText = view.getTitle()
  })
  view.addEventListener('new-window', (e) => {
    // TODO detect if it's not a web url, and then shellexec
    newTab(e.url)
  })
  view.addEventListener('dom-ready', () => {
    view.ready = true
  })
}

function removeTabFromBar(n) {
  document.getElementById('tabs').removeChild(tabs(n))
}

function newTab(url) {
  const view = document.createElement('webview')
  view.setAttribute('autosize', 'on')
  view.setAttribute('src', url || yaeb.newTabUrl)
  view.setAttribute('partition', `persist:${yaeb.profile || 'default'}`)
  view.style.display = 'none'
  document.getElementById('webviewcontainer').appendChild(view)
  const id = views().length - 1
  addTabToBar(id, view)
  focusView(id)
}

function quit() {
  remote.getCurrentWindow().close()
}

function closeTab(id) {
  id = typeof id === 'number' ? id : focusedView
  const view = currentView()
  if (views().length === 1) return quit()
  const nextView = id === 0 ? 1 : id - 1
  removeTabFromBar(id)
  focusView(nextView)
  if (id === 0) focusedView = 0
  document.getElementById('webviewcontainer').removeChild(view)
}

function toggleUrlBar() {
  if (urlBar.style.display !== 'block') {
    urlBar.style.display = 'block'
    urlBar.value = currentView().getURL()
    urlBar.focus()
  } else {
    urlBar.style.display = 'none'
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  newTab()
  urlBar = document.getElementById('urlbar')
  urlBar.addEventListener('keydown', (e) => {
    if (e.which === 13) { // Enter
      currentView().loadURL(urlBar.value)
      tabs(focusedView).innerText = '[Loading...]'
      toggleUrlBar()
    }
  })
})

const configPath = remote.app.getPath('userData')
const fs = require('fs')
const path = require('path')
const browserJs = path.join(configPath, 'browser.js')
if (fs.existsSync(browserJs)) require(browserjs)
const browserCss = path.join(configPath, 'browser.css')
if (fs.existsSync(browserCss)) {
  const styleTag = document.createElement('link')
  styleTag.setAttribute('rel', 'stylesheet')
  styleTag.setAttribute('href', `file://${browserCss}`)
  document.head.appendChild(styleTag)
}