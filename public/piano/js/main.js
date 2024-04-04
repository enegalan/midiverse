import { Render } from "./Rendering/Render.js"
import { UI } from "./ui/UI.js"
import { InputListeners } from "./InputListeners.js"
import { getPlayer, getPlayerState } from "./player/Player.js"
import { loadJson } from "./Util.js"
import { FileLoader } from "./player/FileLoader.js"
/**
 *
 *
 * TODOs:
 *
 * UI:
 * - Accessability
 * - Mobile
 * - Load from URL / circumvent CORS.. Extension?
 * - channel menu
 * - added song info to "loaded songs"
 * - fix the minimize button
 * - Fix fullscreen on mobile
 *
 * Audio
 * - Figure out how to handle different ADSR envelopes / release times for instruments
 * - implement control messages for
 * 		- sostenuto pedal
 * 			- only keys that are pressed while pedal is hit are sustained
 * 		- soft pedal
 * 			- how does that affect sound?
 * - implement pitch shift
 * - settings for playalong:
 * 		- accuracy needed
 * 		- different modes
 *
 * MISC
 * - add starting songs from piano-midi
 * - make instrument choosable for tracks
 * - Metronome
 * - Update readme - new screenshot, install/ run instructions
 * - Choose License
 * -
 * -
 *
 *
 *
 * bugs:
 * - Fix iOS
 * - too long notes disappear too soon
 */
let ui
let loading
let listeners

window.onload = async function () {
	await init()
	loading = true

	//	loadSongFromURL("http://www.piano-midi.de/midis/brahms/brahms_opus1_1_format0.mid")
}

async function init() {
	render = new Render()
	ui = new UI(render)
	listeners = new InputListeners(ui, render)
	renderLoop()

	loadStartingSong()

	loadJson("./piano/js/data/exampleSongs.json", json =>
		ui.setExampleSongs(JSON.parse(json))
	)
}

let render
function renderLoop() {
	render.render(getPlayerState())
	window.requestAnimationFrame(renderLoop)
}
async function loadStartingSong() {
	const domain = window.location.href
	const defaultSong = 'https://app.midiano.com/resources/exampleSongs/piano-midi/mz_311_1.mid'
	const defaultSongName = 'Mozart - Sonata nº8 KV 311 I.'
	let url = localStorage.getItem('playing_midi') ? localStorage.getItem('playing_midi') : defaultSong;
	if (domain.split("github").length > 1) {
		url = "https://app.midiano.com/resources/exampleSongs/piano-midi/mz_311_1.mid"
	}
	var name = localStorage.getItem('playing_midi_name') ? localStorage.getItem('playing_midi_name') : defaultSongName;
	FileLoader.loadSongFromURL(url, (response, fileName) =>
		getPlayer().loadSong(response, fileName, name)
	)
}
