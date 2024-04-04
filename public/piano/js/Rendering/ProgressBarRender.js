import { getSetting } from "../settings/Settings.js";
import { formatTime } from "../Util.js";

/**
 * Renders the progress bar of the song
 */
export class ProgressBarRender {
	constructor(ctx, renderDimensions) {
		this.ctx = ctx;
		this.ctx.canvas.addEventListener(
			"mousemove",
			function (ev) {
				this.mouseX = ev.clientX;
			}.bind(this)
		);
		this.ctx.canvas.addEventListener(
			"mouseleave",
			function (ev) {
				this.mouseX = -1000;
			}.bind(this)
		);
		this.renderDimensions = renderDimensions;
	}
	render(time, end, markers) {
		this.ctx.clearRect(
			0,
			0,
			this.renderDimensions.windowWidth,
			this.renderDimensions.windowHeight
		);

		let ctx = this.ctx;
		let progressPercent = time / (end / 1000);
		let barHeight = 20;
		let borderRadius = 10;
		// Background bar
		ctx.fillStyle = "rgba(80,80,80,0.8)";
		ctx.beginPath();
		ctx.moveTo(0, borderRadius);
		ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
		ctx.lineTo(this.renderDimensions.windowWidth - borderRadius, 0);
		ctx.arcTo(
			this.renderDimensions.windowWidth,
			0,
			this.renderDimensions.windowWidth,
			borderRadius,
			borderRadius
		);
		ctx.lineTo(
			this.renderDimensions.windowWidth,
			barHeight - borderRadius
		);
		ctx.arcTo(
			this.renderDimensions.windowWidth,
			barHeight,
			this.renderDimensions.windowWidth - borderRadius,
			barHeight,
			borderRadius
		);
		ctx.lineTo(borderRadius, barHeight);
		ctx.arcTo(0, barHeight, 0, barHeight - borderRadius, borderRadius);
		ctx.closePath();
		ctx.fill();
		if (progressPercent > 0.0051) {
			// Progress bar
			ctx.fillStyle = "rgba(50,150,50,0.8)";
			ctx.beginPath();
			ctx.moveTo(0, barHeight);
			ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
			ctx.lineTo(this.renderDimensions.windowWidth * progressPercent - borderRadius, 0);
			ctx.arcTo(
				this.renderDimensions.windowWidth * progressPercent,
				0,
				this.renderDimensions.windowWidth * progressPercent,
				borderRadius,
				borderRadius
			);
			ctx.lineTo(
				this.renderDimensions.windowWidth * progressPercent,
				barHeight - borderRadius
			);
			ctx.arcTo(
				this.renderDimensions.windowWidth * progressPercent,
				barHeight,
				this.renderDimensions.windowWidth * progressPercent - borderRadius,
				barHeight,
				borderRadius
			);
			ctx.lineTo(borderRadius, barHeight);
			ctx.arcTo(0, barHeight, 0, barHeight - borderRadius, borderRadius);
			ctx.closePath();
			ctx.fill();
		}

		let isShowingAMarker = false;

		if (getSetting("showMarkersTimeline")) {
			markers.forEach((marker) => {
				let xPos = (marker.timestamp / end) * this.renderDimensions.windowWidth;
				if (Math.abs(xPos - this.mouseX) < 10) {
					isShowingAMarker = true;
					let txtWd = ctx.measureText(marker.text).width;
					ctx.fillStyle = "black";
					ctx.fillText(
						marker.text,
						Math.max(
							5,
							Math.min(
								this.renderDimensions.windowWidth - txtWd - 5,
								xPos - txtWd / 2
							)
						),
						15
					);
				} else {
					ctx.strokeStyle = "black";
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(xPos, 0);
					ctx.lineTo(xPos, 25);
					ctx.closePath();
					ctx.stroke();
				}
			});
		}

		if (!isShowingAMarker) {
			ctx.fillStyle = "rgba(0,0,0,1)";
			let showMilis = getSetting("showMiliseconds");
			let text =
				formatTime(Math.min(time, end), showMilis) +
				" / " +
				formatTime(end / 1000, showMilis);
			let wd = ctx.measureText(text).width;
			ctx.font = "0.9rem Arial black";
			ctx.fillText(
				text,
				this.renderDimensions.windowWidth / 2 - wd / 2,
				15
			);
		}
	}
}
