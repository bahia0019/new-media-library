import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"
import App from "./App"
import "./App.scss"

const button = document.querySelector("#toplevel_page_new-media-library a")

button.addEventListener("click", (e) => {
	e.preventDefault()
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.getElementById("root")
	)
})
