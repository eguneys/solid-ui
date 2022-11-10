import './style.css'
import { render } from 'solid-js/web'
import App from './main-app'

function app(element: HTMLElement) {
  render(App, element)
}


app(document.getElementById('app')!)
