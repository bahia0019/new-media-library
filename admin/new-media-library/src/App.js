import "./App.scss"
import { useBlockProps } from "@wordpress/block-editor"
import React, { useState, useEffect } from "react"
import {
	Button,
	PanelBody,
	SelectControl,
	RadioControl,
	RangeControl,
	ToggleControl,
	TextControl,
	TextareaControl,
	navigateRegions,
	Toolbar,
	ToolbarButton,
	Dashicon,
	Icon,
} from "@wordpress/components"
import axios from "axios"

const siteURL = window.new_media_library_scripts.currentSite

const useKeyPress = function (targetKey) {
	const [keyPressed, setKeyPressed] = useState(false)

	useEffect(() => {
		function downHandler({ key }) {
			if (key === targetKey) {
				setKeyPressed(true)
			}
		}

		const upHandler = ({ key }) => {
			if (key === targetKey) {
				setKeyPressed(false)
			}
		}

		window.addEventListener("keydown", downHandler)
		window.addEventListener("keyup", upHandler)

		return () => {
			window.removeEventListener("keydown", downHandler)
			window.removeEventListener("keyup", upHandler)
		}
	}, [targetKey])

	return keyPressed
}

function App() {
	const [media, setMedia] = useState([])
	const [loading, setLoading] = useState(false)
	const [searchInput, setSearchInput] = useState("")
	const [filteredMedia, setFilteredMedia] = useState([])
	const [currentMediaItem, setCurrentMediaItem] = useState([])
	const [selectedMedia, setSelectedMedia] = useState([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [mediaTypeFilter, setMediaTypeFilter] = useState("")
	const [keywordFilter, setKeywordFilter] = useState("")
	const [apertureFilter, setApertureFilter] = useState("")
	const [columns, setColumns] = useState(8)
	const [thumbRatio, setThumbRatio] = useState("sq")

	const changeColumns = (columns) => {
		setColumns(columns)
	}

	const thumbnailSwitcher = (ratio) => {
		setThumbRatio(ratio)
	}

	/**
	 * Arrow navigation
	 */
	const upPress = useKeyPress("ArrowUp")
	const rightPress = useKeyPress("ArrowRight")
	const downPress = useKeyPress("ArrowDown")
	const leftPress = useKeyPress("ArrowLeft")
	const shiftPress = useKeyPress("Shift")

	// UpPress
	useEffect(
		(e) => {
			if (media.length && upPress) {
				setCurrentIndex((prevState) =>
					prevState > columns ? prevState - columns : prevState
				)
				console.log(e)
			}

			if (media.length && rightPress) {
				setCurrentIndex((prevState) =>
					prevState < media.length - 1 ? prevState + 1 : prevState
				)
				console.log(e)
			}

			if (media.length && downPress) {
				setCurrentIndex((prevState) =>
					prevState < media.length - columns ? prevState + columns : prevState
				)
				console.log(e)
			}

			if (media.length && leftPress) {
				setCurrentIndex((prevState) =>
					prevState > 0 ? prevState - 1 : prevState
				)
				console.log(e)
			}
		},
		[upPress, rightPress, downPress, leftPress]
	)

	// shiftPress
	useEffect(() => {
		if (media.length && shiftPress) {
			console.log("You pressed the shift key")
		}
	}, [shiftPress])

	const currentPhotoSelect = (mediaItem) => (e) => {
		setCurrentMediaItem(mediaItem)

		const found = selectedMedia.find((item) => {
			return item.id === mediaItem.id
		})

		if (found) {
			selectedMedia.filter((found) => found.id !== mediaItem.id)
		} else {
			setSelectedMedia([...selectedMedia, mediaItem])
		}
		// setAlt(photo.alt_text)
		// setCaption(photo.caption.rendered)
		// setTitle(photo.title.rendered)
		// setCopyright(photo.media_details.image_meta.copyright)
		// setCamera(photo.media_details.image_meta.camera)
		// setAperture(photo.media_details.image_meta.aperture)
		// setShutter(photo.media_details.image_meta.shutter_speed)
		// setIso(photo.media_details.image_meta.iso)
		// setLargePhoto(photo.media_details.sizes.large.source_url)

		if (e.target.parentElement.classList.contains("selected")) {
			e.target.parentElement.classList.remove("selected")
		} else {
			e.target.parentElement.classList.add("selected")
		}
	}

	useEffect(() => {
		console.log(currentMediaItem)
		console.log(selectedMedia)
	}, [selectedMedia, currentMediaItem])

	/**
	 * API Call
	 */

	useEffect(() => {
		axios
			.get(`${siteURL}/wp-json/wp/v2/media?per_page=100`)
			.then((response) => {
				setMedia(response.data)
			})
			.catch(function (error) {})
	}, [])

	useEffect(() => {
		// if ("" !== mediaTypeFilter || undefined !== mediaTypeFilter) {
		// 	const filteredData = media.filter((image) => {
		// 		return Object.values([mediaItem.media_type])
		// 			.join("")
		// 			.toLowerCase()
		// 			.includes(mediaTypeFilter.toLowerCase())
		// 	})
		// 	setFilteredMedia(filteredData)
		// }
		// if ("" !== keywordFilter || undefined !== keywordFilter) {
		// 	const filteredData = media.filter((image) => {
		// 		return Object.values([mediaItem.media_details.image_meta.keywords])
		// 			.join("")
		// 			.toLowerCase()
		// 			.includes(keywordFilter.toLowerCase())
		// 	})
		// 	setFilteredMedia(filteredData)
		// }

		if ("" !== apertureFilter || undefined !== apertureFilter) {
			const filteredData = media.filter((mediaItem) => {
				return Object.values([mediaItem.media_details.image_meta.aperture])
					.join("")
					.toLowerCase()
					.includes(apertureFilter)
			})
			setFilteredMedia(filteredData)
		}

		// if ("" !== searchInput) {
		// 	const filteredData = media.filter((image) => {
		// 		return Object.values([
		// 			mediaItem.title.rendered,
		// 			mediaItem.media_details.image_meta?.caption,
		// 		])
		// 			.join("")
		// 			.toLowerCase()
		// 			.includes(searchInput.toLowerCase())
		// 	})
		// 	setFilteredMedia(filteredData)
		// }
	}, [media, mediaTypeFilter, keywordFilter, apertureFilter])
	return (
		<div className="App">
			<header class="media-library-header">
				<div class="top-bar">
					<button className="modal-button">X</button>
					<h1>New Media Library</h1>
				</div>
				<div className="control-panel">
					<SelectControl
						label={"Media Type"}
						value={mediaTypeFilter}
						options={[
							{ label: "Filter By Media", value: "", disabled: false },
							{ label: "Image", value: "image" },
							{ label: "Video", value: "video" },
							{ label: "Text", value: "text" },
							{ label: "Application", value: "application" },
							{ label: "Audio", value: "audio" },
						]}
						onChange={(mediaTypes) => setMediaTypeFilter(mediaTypes)}
					></SelectControl>

					<SelectControl
						label={"Keywords"}
						value={keywordFilter}
						options={[
							{ label: "Filter By Keyword", value: "", disabled: false },
							{ label: "California", value: "california" },
							{ label: "Imperial Beach", value: "imperial beach" },
							{ label: "Sloughs", value: "sloughs" },
							{ label: "Tijuana River", value: "tijuana river" },
						]}
						onChange={(keywords) => setKeywordFilter(keywords)}
					></SelectControl>

					<SelectControl
						label={"Aperture"}
						value={apertureFilter}
						options={[
							{ label: "Aperture", value: "", disabled: false },
							{ label: "f/1.8", value: 1.8 },
							{ label: "f/2", value: 2 },
							{ label: "f/4", value: 4 },
							{ label: "f/8", value: 8 },
						]}
						onChange={(aperture) => setApertureFilter(aperture)}
					></SelectControl>

					<input
						id="search"
						type="text"
						placeholder="Search for your site"
						// onChange={(e) => searchItems(e.target.value)}
					/>
				</div>
			</header>
			<div className={`portal ${selectedMedia.length > 0 ? "w-sidebar" : ""}`}>
				<ul
					className="media-grid"
					style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
				>
					{/* {searchInput.length > 1 || "Filter By Media" !== mediaTypeFilter.label
						? filteredMedia.map((filteredMediaItem) => (
								<li
									key={filteredMediaItem.id}
									className="media-item"
									href={filteredMediaItem.link}
								>
									<img
										src={
											filteredMediaItem.media_details.sizes.medium.source_url
										}
										alt=""
									/>
									<p>{filteredMediaItem.title.rendered}</p>
									<p>{filteredMediaItem.media_details.image_meta?.caption}</p>
								</li>
						  ))
						:  */}
					{media.map((mediaItem, index) => (
						<li
							key={index}
							onClick={currentPhotoSelect(mediaItem)}
							className={(thumbRatio)}
						>
							<img
								src={mediaItem.media_details.sizes.medium.source_url}
								alt=""
							/>
						</li>
					))}
				</ul>
				{selectedMedia.length > 0 && (
					<div class="sidebar">
						<div class="sidebar-thumb-area">
							<img
								alt={currentMediaItem?.alt_text}
								src={currentMediaItem?.source_url}
							></img>
						</div>
						<TextControl
							label={"Title"}
							value={currentMediaItem?.title.rendered}
						></TextControl>
						<TextareaControl
							label={"Alt"}
							value={currentMediaItem?.alt_text}
						></TextareaControl>
						<TextareaControl
							label={"Caption"}
							value={currentMediaItem?.caption.rendered}
						></TextareaControl>

						<h3>EXIF</h3>

						<div id="copyright">
							<strong>Copyright</strong>
							<p>{currentMediaItem?.media_details.image_meta.copyright}</p>
						</div>
						<div id="camera">
							<strong>Camera</strong>
							<p>{currentMediaItem?.media_details.image_meta.camera}</p>
						</div>
						<div id="aperture">
							<strong>Aperture</strong>
							<p>{currentMediaItem?.media_details.image_meta.aperture}</p>
						</div>
						<div id="shutter">
							<strong>Shutter Speed</strong>
							<p>{currentMediaItem?.media_details.image_meta.shutter_speed}</p>
						</div>
						<div id="iso">
							<strong>ISO</strong>
							<p>{currentMediaItem?.media_details.image_meta.iso}</p>
						</div>
					</div>
				)}
			</div>
			<footer class="footer-controls">
				<Toolbar class="footer-toolbar" label="Options">
					<ToolbarButton
						icon={"grid-view"}
						label="Grid"
						onClick={() => console.log("Grid View")}
					/>
					<ToolbarButton
						icon={"list-view"}
						label="List"
						onClick={() => console.log("List View")}
					/>
					|
					<ToolbarButton
						icon={
							<svg id="icon-spinner" viewBox="0 0 32 32">
								<path d="M12 4c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM20.485 7.515c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM26 16c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM22.485 24.485c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM14 28c0 0 0 0 0 0 0-1.105 0.895-2 2-2s2 0.895 2 2c0 0 0 0 0 0 0 1.105-0.895 2-2 2s-2-0.895-2-2zM5.515 24.485c0 0 0 0 0 0 0-1.105 0.895-2 2-2s2 0.895 2 2c0 0 0 0 0 0 0 1.105-0.895 2-2 2s-2-0.895-2-2zM4.515 7.515c0 0 0 0 0 0 0-1.657 1.343-3 3-3s3 1.343 3 3c0 0 0 0 0 0 0 1.657-1.343 3-3 3s-3-1.343-3-3zM1.75 16c0-1.243 1.007-2.25 2.25-2.25s2.25 1.007 2.25 2.25c0 1.243-1.007 2.25-2.25 2.25s-2.25-1.007-2.25-2.25z"></path>
							</svg>
						}
						label="Paginated"
						onClick={() => console.log("Pagination")}
					/>
					<ToolbarButton
						icon={
							<svg id="icon-infinite" viewBox="0 0 32 32">
								<path d="M24.5 23.5c-2.003 0-3.887-0.78-5.303-2.197l-3.197-3.196-3.196 3.196c-1.417 1.417-3.3 2.197-5.303 2.197s-3.887-0.78-5.304-2.197c-1.417-1.417-2.197-3.3-2.197-5.303s0.78-3.887 2.197-5.304c1.417-1.417 3.3-2.197 5.304-2.197s3.887 0.78 5.303 2.197l3.196 3.196 3.196-3.196c1.417-1.417 3.3-2.197 5.303-2.197s3.887 0.78 5.303 2.197c1.417 1.417 2.197 3.3 2.197 5.304s-0.78 3.887-2.197 5.303c-1.416 1.417-3.3 2.197-5.303 2.197zM21.304 19.197c0.854 0.853 1.989 1.324 3.196 1.323s2.342-0.47 3.196-1.324c0.854-0.854 1.324-1.989 1.324-3.196s-0.47-2.342-1.324-3.196c-0.854-0.854-1.989-1.324-3.196-1.324s-2.342 0.47-3.196 1.324l-3.196 3.196 3.196 3.197zM7.5 11.48c-1.207 0-2.342 0.47-3.196 1.324s-1.324 1.989-1.324 3.196c0 1.207 0.47 2.342 1.324 3.196s1.989 1.324 3.196 1.324c1.207 0 2.342-0.47 3.196-1.324l3.196-3.196-3.196-3.196c-0.854-0.854-1.989-1.324-3.196-1.324v0z"></path>
							</svg>
						}
						label="Infinite Scroll"
						onClick={() => console.log("Infinite Scroll")}
					/>
					|
					<ToolbarButton
						icon={
							<svg id="icon-square" viewBox="0 0 24 24">
								<path d="M5 2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM5 4h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v14c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-14c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293z"></path>
							</svg>
						}
						label="Square Thumbnails"
						onClick={() => thumbnailSwitcher("sq")}
					/>
					<ToolbarButton
						icon={
							<svg id="icon-rect" viewBox="0 0 32 32">
								<path
									fill="none"
									stroke="#000"
									stroke-linecap="round"
									stroke-miterlimit="2"
									stroke-width="2"
									d="M0 0h32v32H0z"
								/>
								<path d="M3.5 7h25v18h-25z" />
							</svg>
						}
						label="Rectangle Thumbnails"
						onClick={() => thumbnailSwitcher("rect")}
					/>
                    |
                    <ToolbarButton
						icon={
							<svg id="icon-sidebar" viewBox="0 0 32 32">
                                <path fill="none" d="M0 0h32v32H0z"/>
                                <path fill="none" d="M0 0h32v32H0z"/>
                                <path fill="none" stroke="#000" stroke-linecap="round" stroke-miterlimit="2" stroke-width="2" d="M0 0h32v32H0z" vector-effect="non-scaling-stroke"/>
                                <path stroke="#000" stroke-linecap="square" stroke-miterlimit="3" d="M23 0v32" vector-effect="non-scaling-stroke"/>
                            </svg>
						}
						label="Sidebar"
						onClick={() => console.log("sidebar")}
					/>
                    <ToolbarButton
						icon={
							<svg id="icon-footer" viewBox="0 0 32 32">
                                <path fill="none" d="M0 0h32v32H0z"/>
                                <path fill="none" d="M0 0h32v32H0z"/>
                                <path fill="none" stroke="#000" stroke-linecap="round" stroke-miterlimit="2" stroke-width="2" d="M0 0h32v32H0z" vector-effect="non-scaling-stroke"/>
                                <path stroke="#000" stroke-linecap="square" stroke-miterlimit="3" d="M0 23h32" vector-effect="non-scaling-stroke"/>
                            </svg>
						}
						label="Footer"
						onClick={() => console.log("footer")}
					/>
				</Toolbar>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Showing XX of XXXX media items</span>
					<button>Load More</button>
				</div>
				<div class="thumb-range">
					<RangeControl
						label="Thumbnail Size"
						value={columns}
						onChange={(columns) => changeColumns(columns)}
						min={2}
						max={15}
						initialPosition={8}
						withInputField={false}
						icon="dashicons-format-image"
						showTooltip={false}
					/>
				</div>
			</footer>
		</div>
	)
}

export default App
