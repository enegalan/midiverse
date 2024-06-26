import { DomHelper } from "./DomHelper.js"
import { getSettingsDiv } from "../settings/Settings.js"
import { ZoomUI } from "./ZoomUI.js"
import { createTrackDivs } from "./TrackUI.js"
import { getCurrentSong, getPlayer } from "../player/Player.js"
import { SongUI } from "./SongUI.js"
import { getMidiHandler } from "../MidiInputHandler.js"
/**
 * Contains all initiation, appending and manipulation of DOM-elements.
 * Callback-bindings for some events are created in  the constructor
 */
export class UI {
	constructor(render, isMobile) {
		this.isMobile = window.matchMedia(
			"only screen and (max-width: 1600px)"
		).matches

		this.songUI = new SongUI()
		//add callbacks to the player
		getPlayer().newSongCallbacks.push(this.newSongCallback.bind(this))

		document.body.addEventListener("mousemove", this.mouseMoved.bind(this))

		this.createControlMenu()

		this.menuHeight = 200

		document
			.querySelectorAll(".innerMenuDiv")
			.forEach(
				el =>
				(el.style.height =
					"calc(100% - " + (this.getNavBar().clientHeight + 24) + "px)")
			)

		document.querySelector('#midiverse-piano')?.appendChild(new ZoomUI().getContentDiv(render))
	}

	setExampleSongs(exampleSongsJson) {
		this.songUI.setExampleSongs(exampleSongsJson)
	}

	fireInitialListeners() {
		this.onMenuHeightChange(this.getNavBar().clientHeight)
		window.addEventListener("resize", () => this.onMenuHeightChange(this.getNavBar().clientHeight))
		this.mouseMoved()
	}

	mouseMoved() {
		this.getMinimizeButton().style.opacity = 1
		if (!this.fadingOutMinimizeButton) {
			this.fadingOutMinimizeButton = true
			window.setTimeout(() => {
				this.getMinimizeButton().style.opacity = 0
				this.fadingOutMinimizeButton = false
			}, 1000)
		}
	}
	createControlMenu() {
		let topGroupsContainer = DomHelper.createDivWithClass("menu-container")
		let topNavbar = DomHelper.createDivWithIdAndClass('main-navbar', 'menu-container')

		let fileGrp = this.getFileButtonGroup()
		let songSpeedGrp = this.getSpeedButtonGroup()
		let songControlGrp = this.getSongControlButtonGroup()
		let volumeGrp = this.getVolumneButtonGroup()
		let settingsGrpRight = this.getSettingsButtonGroup()
		let trackGrp = this.getTracksButtonGroup()
		// Main Navbar
		let mainNavbarContent = this.getMainNavbarContent();
		// Hamburger
		let hamburgerBtn = this.getHamburgerButton();
		let closeLink = this.getCloseLink();
		let loadSongLink = this.getLoadSongLink();
		let loadedSongsLink = this.getLoadedSongsLink();
		let midiSetupLink = this.getMidiSetupLink();
		let tracksLink = this.getTracksLink();
		let muteLink = this.getMuteLink();
		let fullscreenLink = this.getFullscreenLink();
		let settingsLink = this.getSettingsLink();

		// Add classes
		DomHelper.addClassToElements("align-middle", [
			fileGrp,
			songSpeedGrp,
			songControlGrp,
			volumeGrp,
			trackGrp
		])

		// Create Elements
		let leftTop = DomHelper.createElementWithIdAndClass('left-container', "hidden flex-lg justify-around flex-1")
		let middleTop = DomHelper.createElementWithIdAndClass('center-container', "topContainer")
		let rightTop = DomHelper.createElementWithIdAndClass('right-container', "hidden flex-lg justify-around flex-1")
		let hamburgerTop = DomHelper.createElementWithIdAndClass('hamburger-container', 'flex flex-lg-hidden lg:hidden justify-center items-center')
		let hamburgerNavbar = DomHelper.createElementWithIdAndClass('hamburger-navbar', 'hidden-hamburger-nav items-stretch fixed bg-gray-700 top-[8rem] z-[700] h-screen lg:hidden w-full  flex flex-col')
		let mainNavbar = DomHelper.createElementWithIdAndClass('mainNavbar', 'mainNavbar');

		// Append childrens
		DomHelper.appendChildren(mainNavbar, [mainNavbarContent])
		DomHelper.appendChildren(leftTop, [fileGrp, trackGrp])
		DomHelper.appendChildren(middleTop, [songControlGrp])
		DomHelper.appendChildren(rightTop, [
			songSpeedGrp,
			volumeGrp,
			settingsGrpRight
		])
		DomHelper.appendChildren(hamburgerTop, [hamburgerBtn])
		DomHelper.appendChildren(hamburgerNavbar, [
			closeLink,
			loadSongLink,
			loadedSongsLink,
			midiSetupLink,
			tracksLink,
			muteLink,
			fullscreenLink,
			settingsLink,
		])
		DomHelper.appendChildren(topNavbar, [mainNavbarContent])
		DomHelper.appendChildren(topGroupsContainer, [leftTop, middleTop, rightTop, hamburgerTop])
		this.getNavBar().appendChild(topNavbar)
		this.getNavBar().appendChild(topGroupsContainer)

		// Minimize Button
		let minimizeButton = this.getMinimizeButton()
		let innerMenuDivsContainer = DomHelper.createElementWithClass(
			"innerMenuDivsContainer"
		)
		DomHelper.appendChildren(innerMenuDivsContainer, [
			this.getTrackMenuDiv(),
			this.getLoadedSongsDiv(),
			this.getSettingsDiv()
		])

		// Last appendChilds
		document.querySelector('#midiverse-piano')?.appendChild(minimizeButton)
		document.querySelector('#midiverse-piano')?.appendChild(this.getNavBar())
		document.querySelector('#midiverse-piano-menus')?.appendChild(innerMenuDivsContainer)
		document.querySelector('#playground-navbar')?.appendChild(hamburgerNavbar)

		// Create File Drag Area
		this.createFileDragArea()
	}

	getHamburgerButton() {
		if (!this.hamburgerButton) {
			this.hamburgerButton = DomHelper.createGlyphiconButton(
				'hamburger-button',
				'menu-hamburger',
				() => {
					this.toggleHamburgerNavbar()
				}
			)
		}
		return this.hamburgerButton;
	}

	getCloseLink() {
		if (!this.closeLink) {
			this.closeLink = DomHelper.createGlyphiconButton(
				'close-button',
				'remove',
				() => {
					this.toggleHamburgerNavbar()
				}
			)
			DomHelper.addClassToElement('hamburger-link', this.closeLink)
			DomHelper.addClassToElement('closeButton', this.closeLink)
		}
		return this.closeLink;
	}

	getMinimizeButton() {
		if (!this.minimizeButton) {
			this.minimizeButton = DomHelper.createGlyphiconButton(
				"minimizeMenu",
				"chevron-up",
				() => {
					if (!this.navMinimized) {
						this.getNavBar().style.marginTop =
							"-" + this.getNavBar().clientHeight + "px"
						this.navMinimized = true
						this.minimizeButton
							.querySelector("span")
							.classList.remove("glyphicon-chevron-up")
						this.minimizeButton
							.querySelector("span")
							.classList.add("glyphicon-chevron-down")
						this.onMenuHeightChange(0)
					} else {
						this.getNavBar().style.marginTop = "0px"
						this.navMinimized = false

						this.minimizeButton
							.querySelector("span")
							.classList.add("glyphicon-chevron-up")
						this.minimizeButton
							.querySelector("span")
							.classList.remove("glyphicon-chevron-down")
						this.onMenuHeightChange(this.getNavBar().clientHeight)
					}
				}
			)
			this.minimizeButton.style.fontSize = "0.5em"
		}
		let navbarHeight = this.navMinimized ? 0 : this.getNavBar().clientHeight
		this.minimizeButton.style.top = navbarHeight + 23 + "px"
		return this.minimizeButton
	}

	getSettingsButtonGroup() {
		let settingsGrpRight = DomHelper.createButtonGroup(true)
		DomHelper.appendChildren(settingsGrpRight, [
			this.getFullscreenButton(),
			this.getSettingsButton()
		])
		return settingsGrpRight
	}
	setOnMenuHeightChange(func) {
		this.onMenuHeightChange = func
	}

	getTracksButtonGroup() {
		let trackGrp = DomHelper.createButtonGroup(true)
		DomHelper.appendChildren(trackGrp, [
			this.getTracksButton(),
			this.getMidiSetupButton()
			// this.getChannelsButton()
		])
		return trackGrp
	}

	getVolumneButtonGroup() {
		let volumeGrp = DomHelper.createButtonGroup(true)
		DomHelper.appendChildren(volumeGrp, [
			this.getMainVolumeSlider().container
		])
		return volumeGrp
	}

	getSongControlButtonGroup() {
		let songControlGrp = DomHelper.createButtonGroup(false)
		DomHelper.appendChildren(songControlGrp, [
			this.getPlayButton(),
			this.getPauseButton(),
			this.getStopButton()
		])
		return songControlGrp
	}

	getSpeedButtonGroup() {
		let songSpeedGrp = DomHelper.createButtonGroup(true)
		DomHelper.appendChildren(songSpeedGrp, [this.getSpeedDiv()])
		return songSpeedGrp
	}

	getFileButtonGroup() {
		let fileGrp = DomHelper.createButtonGroup(true)
		DomHelper.appendChildren(fileGrp, [
			this.getLoadSongButton(),
			this.getLoadedSongsButton()
		])
		return fileGrp
	}

	getMainNavbarContent() {
		let navbarGrp = DomHelper.createButtonGroup(true)
		DomHelper.appendChildren(navbarGrp, [
			this.getMainNavbar(),
		])
		return navbarGrp
	}

	getMainNavbar() {
		if (!this.mainNavbar) {
			this.mainNavbar = DomHelper.createDiv({
				"minWidth": "118px",
				"width": "100%",
				"height": "100%",
				"justifyContent": "space-between",
				"paddingTop": "4px",
				"paddingX": "10px",
				"color": "white",
				"position": "relative",
				"left": "0",
				"zIndex": "30",
				"transition": "ease-in-out",
				"transitionDuration": "500ms",
				"display": "flex",
			});
			let logoContainer = DomHelper.createDivWithClass("flex items-center flex-wrap w-full");
			let logoLink = DomHelper.createElementWithClass("text-4xl font-bold justify-center flex gap-8 w-full self-center", "a", "", { 'href': '/home', 'data-ref': 'home' });
			let logoImage = DomHelper.createElementWithClass("w-12 pointer-events-none select-none", "img", "", { 'alt': 'Logo', 'src': "/logoBlack.svg" });
			logoLink.appendChild(logoImage);
			logoContainer.appendChild(logoLink);

			let navItemsContainer = DomHelper.createDivWithClass("flex-1 justify-center flex");
			let ul = DomHelper.createElement("ul", {
				'display': 'flex',
				'justify-content': 'center',
			});

			let navItems = [
				{ "href": "/home", "text": "Home", "icon": "home", "ref": "home", },
				{ "href": "/explore", "text": "Explore", "icon": "search", "ref": "explore", },
				{ "href": "/concerts", "text": "Concerts", "icon": "music", "ref": "concerts", },
				{ "href": "/", "text": "Notifications", "icon": "bell", "ref": "notifications", },
				{ "href": "/messages", "text": "Messages", "icon": "envelope", "ref": "messages", },
				{ "href": "/", "text": "Bookmarks", "icon": "bookmark", "ref": "bookmarks", },
				{ "href": "/profile", "text": "Profile", "icon": "user", "ref": "profile", },
			];

			navItems.forEach(item => {
				let li = DomHelper.createElement("li", {}, { className: "xl:px-1 transition rounded-full self-center hover:bg-gray-300 w-full select-none" });
				let link = DomHelper.createElement("a", {}, { href: item.href, className: "p-3 xl:p-3 text-lg flex items-center xl:items-center gap-3" });
				let iconSpan = DomHelper.getGlyphicon(item.icon);
				let textSpan = DomHelper.createElement("span", {}, { className: "hidden xl:block" });
				textSpan.innerText = item.text;
				link.appendChild(iconSpan);
				link.appendChild(textSpan);
				li.appendChild(link);
				ul.appendChild(li);
			});

			navItemsContainer.appendChild(ul);

			this.mainNavbar.appendChild(logoContainer);
			this.mainNavbar.appendChild(navItemsContainer);
		}
		return this.mainNavbar
	}

	getNavBar() {
		if (!this.navBar) {
			this.navBar = DomHelper.createElement(
				"nav",
				{},
				{
					className: "navbar navbar-wrapper"
				}
			)
		}
		return this.navBar
	}
	getSettingsLink() {
		if (!this.settingsLink) {
			this.settingsLink = DomHelper.createGlyphiconTextButton(
				"settingsButton",
				"cog",
				"Settings",
				() => {
					this.showSettings()
					this.toggleHamburgerNavbar()
				}
			)
			DomHelper.addClassToElement('hamburger-link', this.settingsLink)
		}
		return this.settingsLink
	}
	getSettingsButton() {
		if (!this.settingsButton) {
			this.settingsButton = DomHelper.createGlyphiconButton(
				"settingsButton",
				"cog",
				() => {
					if (this.settingsShown) {
						this.hideSettings()
					} else {
						this.showSettings()
					}
				}
			)
		}
		return this.settingsButton
	}
	hideDiv(div) {
		div.classList.add("hidden")
		div.classList.remove("unhidden")
	}
	showDiv(div) {
		div.classList.remove("hidden")
		div.classList.add("unhidden")
	}
	toggleHamburgerNavbar() {
		document.querySelector('#hamburger-navbar')?.classList.toggle('hidden-hamburger-nav')
	}
	hideSettings() {
		DomHelper.removeClass("selected", this.getSettingsButton())
		this.settingsShown = false
		this.hideDiv(this.getSettingsDiv())
	}
	showSettings() {
		this.hideAllDialogs()
		DomHelper.addClassToElement("selected", this.getSettingsButton())
		this.settingsShown = true
		this.showDiv(this.getSettingsDiv())
	}
	getSettingsDiv() {
		if (!this.settingsDiv) {
			this.settingsDiv = DomHelper.createDivWithIdAndClass(
				"settingsDiv",
				"innerMenuDiv"
			)
			this.hideDiv(this.settingsDiv)
			let closeButton = DomHelper.createGlyphiconButton(
				'settings-close',
				'remove',
				() => {
					this.hideDiv(this.settingsDiv)
				}
			)
			this.settingsDiv.appendChild(closeButton)
			this.settingsDiv.appendChild(this.getSettingsContent())
		}
		return this.settingsDiv
	}
	getSettingsContent() {
		return getSettingsDiv()
	}
	getFullscreenButton() {
		if (!this.fullscreenButton) {
			this.fullscreen = false
			let clickFullscreen = () => {
				if (!this.fullscreen) {
					document.body.requestFullscreen()
				} else {
					document.exitFullscreen()
				}
			}
			this.fullscreenButton = DomHelper.createGlyphiconButton(
				"fullscreenButton",
				"fullscreen",
				clickFullscreen.bind(this)
			)
			let fullscreenSwitch = () => (this.fullscreen = !this.fullscreen)
			document.body.onfullscreenchange = fullscreenSwitch.bind(this)
		}
		return this.fullscreenButton
	}
	getFullscreenLink() {
		if (!this.fullscreenLink) {
			this.fullscreen = false
			let clickFullscreen = () => {
				if (!this.fullscreen) {
					document.body.requestFullscreen()
				} else {
					document.exitFullscreen()
				}
			}
			this.fullscreenLink = DomHelper.createGlyphiconTextButton(
				"fullscreenLink",
				"fullscreen",
				'Fullscreen',
				clickFullscreen.bind(this),
				'hamburger-link'
			)
			let fullscreenSwitch = () => (this.fullscreen = !this.fullscreen)
			document.body.onfullscreenchange = fullscreenSwitch.bind(this)
		}
		return this.fullscreenLink
	}
	getLoadSongButton() {
		if (!this.loadSongButton) {
			this.loadSongButton = DomHelper.createFileInput(
				"Upload Midi",
				this.handleFileSelect.bind(this)
			)
			DomHelper.addClassToElement("floatSpanLeft", this.loadSongButton)
		}
		return this.loadSongButton
	}
	getLoadSongLink() {
		if (!this.loadSongLink) {
			this.loadSongLink = DomHelper.createFileInput(
				"Upload Midi",
				this.handleFileSelect.bind(this)
			)
			DomHelper.addClassToElement('hamburger-link', this.loadSongLink)
		}
		return this.loadSongLink
	}
	getLoadedSongsLink() {
		if (!this.loadedSongsLink) {
			this.loadedSongsLink = DomHelper.createGlyphiconTextButton(
				"mute",
				"music",
				"Loaded Songs",
				ev => {
					this.toggleHamburgerNavbar()
					this.showLoadedSongsDiv()
				}
			)
			DomHelper.addClassToElement('hamburger-link', this.loadedSongsLink)
		}
		return this.loadedSongsLink
	}
	getLoadedSongsButton() {
		if (!this.loadedSongsButton) {
			this.loadedSongsButton = DomHelper.createGlyphiconTextButton(
				"mute",
				"music",
				"Loaded Songs",
				ev => {
					if (this.loadedSongsShown) {
						this.hideLoadedSongsDiv()
					} else {
						this.showLoadedSongsDiv()
					}
				}
			)
		}
		return this.loadedSongsButton
	}
	showLoadedSongsDiv() {
		this.hideAllDialogs()
		DomHelper.addClassToElement("selected", this.loadedSongsButton)
		this.loadedSongsShown = true
		this.showDiv(this.getLoadedSongsDiv())
	}

	hideLoadedSongsDiv() {
		DomHelper.removeClass("selected", this.loadedSongsButton)
		this.loadedSongsShown = false
		this.hideDiv(this.getLoadedSongsDiv())
	}

	getLoadedSongsDiv() {
		if (!this.loadedSongsDiv) {
			this.loadedSongsDiv = DomHelper.createDivWithIdAndClass('loaded-songs', "innerMenuDiv")
			this.loadedSongsDiv.appendChild(this.songUI.getDivContent())
			this.hideDiv(this.loadedSongsDiv)
		}
		return this.loadedSongsDiv
	}

	createFileDragArea() {
		let dragArea = DomHelper.createElement(
			"div",
			{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				zIndex: 10000,
				visibility: "hidden",
				opacity: "0",
				backgroundColor: "rgba(0,0,0,0.2)",
				transition: "all 0.2s ease-out"
			},
			{
				draggable: "true"
			}
		)

		let dragAreaText = DomHelper.createDivWithClass(
			"centeredBigText",
			{
				marginTop: "25%",
				fontSize: "35px",
				color: "rgba(225,225,225,0.8)"
			},
			{ innerHTML: "Drop Midi File anywhere!" }
		)
		dragArea.appendChild(dragAreaText)

		dragArea.ondrop = ev => {
			dragArea.style.backgroundColor = "rgba(0,0,0,0)"
			this.handleDragDropFileSelect(ev)
		}
		let lastTarget
		window.ondragenter = ev => {
			ev.preventDefault()
			lastTarget = ev.target
			dragArea.style.visibility = ""
			dragArea.style.opacity = "1"
		}
		window.ondragleave = ev => {
			if (ev.target === lastTarget || ev.target === document) {
				dragArea.style.visibility = "hidden"
				dragArea.style.opacity = "0"
			}
		}
		window.ondragover = ev => ev.preventDefault()
		window.ondrop = ev => {
			ev.preventDefault()
			dragArea.style.visibility = "hidden"
			dragArea.style.opacity = "0"
			this.handleDragDropFileSelect(ev)
		}
		document.querySelector('#midiverse-piano')?.appendChild(dragArea)
	}
	handleDragOverFile(ev) {
		this.createFileDragArea().style
	}
	handleDragDropFileSelect(ev) {
		if (ev.dataTransfer.items) {
			// Use DataTransferItemList interface to access the file(s)
			if (ev.dataTransfer.items.length > 0) {
				if (ev.dataTransfer.items[0].kind === "file") {
					var file = ev.dataTransfer.items[0].getAsFile()
					this.readFile(file)
				}
			}
		} else {
			// Use DataTransfer interface to access the file(s)
			if (ev.dataTransfer.files.length > 0) {
				var file = ev.dataTransfer.files[0]
				this.readFile(file)
			}
		}
	}
	handleFileSelect(evt) {
		var files = evt.target.files
		for (var i = 0, f; (f = files[i]); i++) {
			this.readFile(f)
		}
	}
	readFile(file) {
		let reader = new FileReader()
		let fileName = file.name
		reader.onload = function (theFile) {
			getPlayer().loadSong(reader.result, fileName)
		}.bind(this)
		reader.readAsDataURL(file)
	}

	getSpeedDiv() {
		if (!this.speedDiv) {
			this.speedDiv = DomHelper.createDivWithClass(
				"btn-group btn-group-vertical"
			)
			this.speedDiv.appendChild(this.getSpeedUpButton())
			this.speedDiv.appendChild(this.getSpeedDisplayField())
			this.speedDiv.appendChild(this.getSpeedDownButton())
		}
		return this.speedDiv
	}
	getSpeedUpButton() {
		if (!this.speedUpButton) {
			this.speedUpButton = DomHelper.createGlyphiconButton(
				"speedUp",
				"triangle-top",
				ev => {
					getPlayer().increaseSpeed(0.05)
					this.updateSpeed()
				}
			)
			this.speedUpButton.className += " btn-xs forcedThinButton"
		}
		return this.speedUpButton
	}
	updateSpeed() {
		this.getSpeedDisplayField().value =
			Math.round(getPlayer().playbackSpeed * 100) + "%"
	}
	getSpeedDisplayField() {
		if (!this.speedDisplay) {
			this.speedDisplay = DomHelper.createTextInput(
				ev => {
					let newVal = Math.max(1, Math.min(1000, parseInt(ev.target.value)))
					if (!isNaN(newVal)) {
						ev.target.value = newVal + "%"
						getPlayer().playbackSpeed = newVal / 100
					}
				},
				{
					float: "none",
					textAlign: "center"
				},
				{
					value: Math.floor(getPlayer().playbackSpeed * 100) + "%",
					className: "forcedThinButton",
					type: "text"
				}
			)
		}
		return this.speedDisplay
	}
	getSpeedDownButton() {
		if (!this.speedDownButton) {
			this.speedDownButton = DomHelper.createGlyphiconButton(
				"speedUp",
				"triangle-bottom",
				ev => {
					getPlayer().increaseSpeed(-0.05)
					this.updateSpeed()
				}
			)
			this.speedDownButton.className += " btn-xs forcedThinButton"
		}
		return this.speedDownButton
	}
	getTracksLink() {
		if (!this.tracksLink) {
			this.tracksLink = DomHelper.createGlyphiconTextButton(
				"tracks",
				"align-justify",
				"Tracks",
				ev => {
					this.showTracks()
					this.toggleHamburgerNavbar()
				}
			)
			DomHelper.addClassToElement("hamburger-link", this.tracksLink)
		}
		return this.tracksLink
	}
	getTracksButton() {
		if (!this.tracksButton) {
			this.tracksButton = DomHelper.createGlyphiconTextButton(
				"tracks",
				"align-justify",
				"Tracks",
				ev => {
					if (this.tracksShown) {
						this.hideTracks()
					} else {
						this.showTracks()
					}
				}
			)
			DomHelper.addClassToElement("floatSpanLeft", this.tracksButton)
		}
		return this.tracksButton
	}
	hideTracks() {
		DomHelper.removeClass("selected", this.tracksButton)
		this.tracksShown = false
		this.hideDiv(this.getTrackMenuDiv())
	}

	showTracks() {
		this.hideAllDialogs()
		DomHelper.addClassToElement("selected", this.tracksButton)
		this.tracksShown = true
		//instrument of a track could theoretically change during the song.
		document
			.querySelectorAll(".instrumentName")
			.forEach(
				el =>
				(el.innerHTML = getPlayer().getCurrentTrackInstrument(
					el.id.split("instrumentName")[1]
				))
			)
		this.showDiv(this.getTrackMenuDiv())
	}

	getMidiSetupLink() {
		if (!this.midiSetupLink) {
			this.midiSetupLink = DomHelper.createGlyphiconTextButton(
				"midiSetup",
				"tower",
				"Midi-Setup",
				ev => {
					this.showMidiSetupDialog()
					this.toggleHamburgerNavbar()
				}
			)
			DomHelper.addClassToElement("hamburger-link", this.midiSetupLink)
		}
		return this.midiSetupLink
	}

	getMidiSetupButton() {
		if (!this.midiSetupButton) {
			this.midiSetupButton = DomHelper.createGlyphiconTextButton(
				"midiSetup",
				"tower",
				"Midi-Setup",
				ev => {
					if (this.midiSetupDialogShown) {
						this.hideMidiSetupDialog()
					} else {
						this.showMidiSetupDialog()
					}
				}
			)
			DomHelper.addClassToElement("floatSpanLeft", this.midiSetupButton)
		}
		return this.midiSetupButton
	}
	hideMidiSetupDialog() {
		DomHelper.removeClass("selected", this.midiSetupButton)
		this.midiSetupDialogShown = false
		this.hideDiv(this.getMidiSetupDialog())
	}

	showMidiSetupDialog() {
		this.hideAllDialogs()
		DomHelper.addClassToElement("selected", this.midiSetupButton)
		this.midiSetupDialogShown = true

		this.showDiv(this.getMidiSetupDialog())
	}
	getChannelsButton() {
		if (!this.channelsButton) {
			let channelMenuDiv = this.getChannelMenuDiv()
			this.channelsButton = DomHelper.createGlyphiconTextButton(
				"channels",
				"align-justify",
				"Channels",
				ev => {
					if (this.channelsShown) {
						this.hideChannels(channelMenuDiv)
					} else {
						this.showChannels(channelMenuDiv)
					}
				}
			)
			DomHelper.addClassToElement("floatSpanLeft", this.channelsButton)

			//Todo. decide what channel info to show...
			this.channelsButton.style.opacity = 0
		}
		return this.channelsButton
	}
	getChannelMenuDiv() {
		if (!this.channelMenuDiv) {
			this.channelMenuDiv = DomHelper.createDivWithId("trackContainerDiv")
			this.channelMenuDiv.style.display = "none"
			this.channelMenuDiv.style.top = this.getNavBar().style.height
			document.body.appendChild(this.channelMenuDiv)
		}
		return this.channelMenuDiv
	}
	showChannels(channelMenuDiv) {
		if (this.tracksShown) {
			this.hideTracks()
		}
		DomHelper.addClassToElement("selected", this.tracksButton)
		this.channelsShown = true
		channelMenuDiv.style.display = "block"
	}

	hideChannels(channelMenuDiv) {
		DomHelper.removeClass("selected", this.tracksButton)
		this.channelsShown = false
		channelMenuDiv.style.display = "none"
	}
	hideAllDialogs() {
		// this.hideChannels()
		this.hideMidiSetupDialog()
		this.hideSettings()
		this.hideLoadedSongsDiv()
		this.hideTracks()
		this.hideLoadedSongsDiv()
	}

	getMainVolumeSlider() {
		if (!this.mainVolumeSlider) {
			this.mainVolumeSlider = DomHelper.createSliderWithLabel(
				"volumeMain",
				"Master Volume",
				getPlayer().volume,
				0,
				100,
				1,
				ev => {
					if (getPlayer().volume == 0 && parseInt(ev.target.value) != 0) {
						DomHelper.replaceGlyph(
							this.getMuteButton(),
							"volume-off",
							"volume-up"
						)
						//this.getMuteButton().firstChild.className = this.muteButton.firstChild.className.replace('volume-off', 'volume-up')
					}
					getPlayer().volume = parseInt(ev.target.value)
					if (getPlayer().volume <= 0) {
						DomHelper.replaceGlyph(
							this.getMuteButton(),
							"volume-up",
							"volume-off"
						)
					} else if (this.getMuteButton().innerHTML == "Unmute") {
						DomHelper.replaceGlyph(
							this.getMuteButton(),
							"volume-off",
							"volume-up"
						)
					}
				},
				this.getMuteButton()
			)
		}
		return this.mainVolumeSlider
	}
	getMuteLink() {
		if (!this.muteLink) {
			this.muteLink = DomHelper.createGlyphiconTextButton(
				"mute",
				"volume-up",
				"Mute",
				ev => {
					if (getPlayer().muted) {
						getPlayer().muted = false
						if (!isNaN(getPlayer().mutedAtVolume)) {
							if (getPlayer().mutedAtVolume == 0) {
								getPlayer().mutedAtVolume = 100
							}
							this.getMainVolumeSlider().slider.value = getPlayer().mutedAtVolume
							getPlayer().volume = getPlayer().mutedAtVolume
						}
						DomHelper.replaceGlyph(this.muteLink, "volume-off", "volume-up")

					} else {
						getPlayer().mutedAtVolume = getPlayer().volume
						getPlayer().muted = true
						getPlayer().volume = 0
						this.getMainVolumeSlider().slider.value = 0
						DomHelper.replaceGlyph(this.muteLink, "volume-up", "volume-off")
					}
				},
				'hamburger-link'
			)
		}
		return this.muteLink
	}
	getMuteButton() {
		if (!this.muteButton) {
			this.muteButton = DomHelper.createGlyphiconButton(
				"mute",
				"volume-up",
				ev => {
					if (getPlayer().muted) {
						getPlayer().muted = false
						if (!isNaN(getPlayer().mutedAtVolume)) {
							if (getPlayer().mutedAtVolume == 0) {
								getPlayer().mutedAtVolume = 100
							}
							this.getMainVolumeSlider().slider.value = getPlayer().mutedAtVolume
							getPlayer().volume = getPlayer().mutedAtVolume
						}
						DomHelper.replaceGlyph(this.muteButton, "volume-off", "volume-up")
					} else {
						getPlayer().mutedAtVolume = getPlayer().volume
						getPlayer().muted = true
						getPlayer().volume = 0
						this.getMainVolumeSlider().slider.value = 0
						DomHelper.replaceGlyph(this.muteButton, "volume-up", "volume-off")
					}
				}
			)
		}
		return this.muteButton
	}
	getPlayButton() {
		if (!this.playButton) {
			this.playButton = DomHelper.createGlyphiconButton(
				"play",
				"play",
				this.clickPlay.bind(this)
			)
			DomHelper.addClassToElement("btn-lg", this.playButton)
		}
		return this.playButton
	}
	clickPlay(ev) {
		if (getPlayer().song) {
			DomHelper.removeClass("selected", this.getPauseButton())
			getPlayer().startPlay()
			DomHelper.addClassToElement("selected", this.playButton)
		}
	}
	getPauseButton() {
		if (!this.pauseButton) {
			this.pauseButton = DomHelper.createGlyphiconButton(
				"pause",
				"pause",
				this.clickPause.bind(this)
			)
			DomHelper.addClassToElement("btn-lg", this.pauseButton)
		}
		return this.pauseButton
	}
	clickPause(ev) {
		getPlayer().pause()
		DomHelper.removeClass("selected", this.getPlayButton())

		DomHelper.addClassToElement("selected", this.pauseButton)
	}

	getStopButton() {
		if (!this.stopButton) {
			this.stopButton = DomHelper.createGlyphiconButton(
				"stop",
				"stop",
				this.clickStop.bind(this)
			)

			DomHelper.addClassToElement("btn-lg", this.stopButton)
		}
		return this.stopButton
	}
	clickStop(ev) {
		getPlayer().stop()
		DomHelper.removeClass("selected", this.getPlayButton())
		DomHelper.removeClass("selected", this.getPauseButton())
	}
	resetTrackMenuDiv() {
		let menuDiv = this.getTrackMenuDiv()
		menuDiv.innerHTML = ""
		DomHelper.appendChildren(menuDiv, createTrackDivs())
	}
	newSongCallback() {
		this.resetTrackMenuDiv()
		this.clickStop()
		this.songUI.newSongCallback(getCurrentSong())
	}

	getMidiSetupDialog() {
		if (!this.midiSetupDialog) {
			this.midiSetupDialog = DomHelper.createDivWithIdAndClass(
				"midiSetupDialog",
				"centeredMenuDiv"
			)
			this.hideDiv(this.midiSetupDialog)
			document.body.appendChild(this.midiSetupDialog)

			let closeButton = DomHelper.createGlyphiconButton(
				'midi-setup-close',
				'remove',
				() => {
					this.hideDiv(this.midiSetupDialog)
				},
				'flex lg:hidden'
			)
			DomHelper.addClassToElement('float-right', closeButton)
			this.midiSetupDialog.appendChild(closeButton)

			let text = DomHelper.createDivWithClass(
				"centeredBigText",
				{ marginTop: "25px" },
				{ innerHTML: "Choose Midi device:" }
			)
			this.midiSetupDialog.appendChild(text)

			this.inputDevicesDiv = DomHelper.createDivWithClass("halfContainer")
			this.outputDevicesDiv = DomHelper.createDivWithClass("halfContainer")
			this.midiSetupDialog.appendChild(this.inputDevicesDiv)
			this.midiSetupDialog.appendChild(this.outputDevicesDiv)
		}
		let inputDevices = getMidiHandler().getAvailableInputDevices()
		if (inputDevices.length == 0) {
			this.inputDevicesDiv.innerHTML = "No MIDI input-devices found."
		} else {
			this.inputDevicesDiv.innerHTML = ""
			let inputTitle = DomHelper.createElementWithClass("row", "span")
			inputTitle.innerHTML = "Input: "
			this.inputDevicesDiv.appendChild(inputTitle)
			inputDevices.forEach(device => {
				this.inputDevicesDiv.appendChild(this.createDeviceDiv(device))
			})
		}

		let outputDevices = getMidiHandler().getAvailableOutputDevices()
		if (outputDevices.length == 0) {
			this.outputDevicesDiv.innerHTML = "No MIDI output-devices found."
		} else {
			this.outputDevicesDiv.innerHTML = ""
			let outputTitle = DomHelper.createDivWithClass("row")
			outputTitle.innerHTML = "Output: "
			this.outputDevicesDiv.appendChild(outputTitle)
			outputDevices.forEach(device => {
				this.outputDevicesDiv.appendChild(this.createOutputDeviceDiv(device))
			})
		}
		this.midiSetupDialog.style.marginTop =
			this.getNavBar().clientHeight + 25 + "px"
		return this.midiSetupDialog
	}
	createDeviceDiv(device) {
		let deviceDiv = DomHelper.createTextButton(
			"midiInDeviceDiv" + device.id,
			device.name,
			() => {
				if (deviceDiv.classList.contains("selected")) {
					DomHelper.removeClass("selected", deviceDiv)
					getMidiHandler().clearInput(device)
				} else {
					DomHelper.addClassToElement("selected", deviceDiv)
					getMidiHandler().addInput(device)
				}
			}
		)
		if (getMidiHandler().isDeviceActive(device)) {
			DomHelper.addClassToElement("selected", deviceDiv)
		}

		return deviceDiv
	}
	createOutputDeviceDiv(device) {
		let deviceDiv = DomHelper.createTextButton(
			"midiOutDeviceDiv" + device.id,
			device.name,
			() => {
				if (deviceDiv.classList.contains("selected")) {
					DomHelper.removeClass("selected", deviceDiv)
					getMidiHandler().clearOutput(device)
				} else {
					DomHelper.addClassToElement("selected", deviceDiv)
					getMidiHandler().addOutput(device)
				}
			}
		)
		if (getMidiHandler().isOutputDeviceActive(device)) {
			document
				.querySelectorAll(".midiOutDeviceDiv")
				.forEach(el =>
					el.classList.contains("selected")
						? el.classList.remove("selected")
						: null
				)
			DomHelper.addClassToElement("selected", deviceDiv)
		}
		deviceDiv.classList.add("midiOutDeviceDiv")

		return deviceDiv
	}
	getTrackMenuDiv() {
		if (!this.trackMenuDiv) {
			this.trackMenuDiv = DomHelper.createDivWithIdAndClass(
				"trackContainerDiv",
				"innerMenuDiv"
			)
			this.hideDiv(this.trackMenuDiv)
		}
		return this.trackMenuDiv
	}
}
