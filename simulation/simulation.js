class Clock {
	constructor(width, height, images){
		this.width = width;
		this.height = height;
		this.pixelSize = this.height / 32;
		this.cols = 5;
	}

	drawBar(ctx, column, bgcolor, cells) {
		const ps = this.pixelSize;
		const top = (this.height - (cells.length*ps)) / 2;
		const left = (this.width / this.cols) * (column + 1) - ps / 2;

		for (var i = 0; i < cells.length; i++) {
			ctx.fillStyle = bgcolor;
			ctx.fillRect(left, top + ps * i, ps, ps);

			ctx.beginPath();
			ctx.fillStyle=cells[i];
			ctx.arc(left + ps/2, top + ps*i+ps/2, ps/2, 0, 2 * Math.PI, false);
			ctx.fill();
		}
	}

	drawMinutes(ctx) {
		const d = new Date();
		const min = d.getMinutes();
		const ps = this.pixelSize;

		const cells = [];

		for (var i = 0; i < 30; i++) {
			const curMin = min/2.0;
			if (curMin > 30 - i) {
				cells.push("green");
			} else {
				cells.push("gray");
			}
		}

		this.drawBar(ctx, 1, "#aaaaaa", cells);
	}

	drawHours(ctx) {
		// Days
		const hday = this.pixelSize;
		const wday = hday;

		const lday = (this.width / this.cols) - this.pixelSize / 2;
		const tday = (this.height - (24*hday)) / 2;

		const d = new Date();
		const hour = d.getHours();
		const min = d.getMinutes();

		for (var i = 0; i < 24; i++) {
			ctx.lineWidth=0;

			// fill the background square
			ctx.fillStyle='#aaaaaa';
			ctx.fillRect(lday, tday + wday*i, wday, hday);

			// draw the light
			ctx.beginPath();

			// hour position is inverted
			const curHour = 24 - i;
			if (curHour < hour) {
				ctx.fillStyle="green";
			} else if (curHour == hour) {
				ctx.fillStyle = 'rgb(0, ' + ((min/60) * 255) + ', 0)'
			} else {
				ctx.fillStyle="gray";
			}
			ctx.arc(lday + wday/2, tday + hday*i+hday/2, hday/2, 0, 2 * Math.PI, false);
			ctx.fill();
		}
	}

	draw(ctx) {
		const wood = document.getElementById("wood");

		ctx.drawImage(wood, 0, 0, this.width, this.height);
		this.drawHours(ctx);
		this.drawMinutes(ctx);
	}
}

const clock = new Clock(300, 700, ["wood"]);

function loaded() {
	const canvas = document.getElementById("my-house");
	const ctx = canvas.getContext("2d");
	clock.draw(ctx);
}