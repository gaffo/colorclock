class Clock {
	constructor(width, height, images){
		this.width = width;
		this.height = height;
		this.pixelSize = this.height / 32;
		this.cols = 5;
	}

	drawMinutes(ctx) {
		const d = new Date();
		const min = d.getMinutes();
		const ps = this.pixelSize;

		const lmin = ((this.width / this.cols) * 2) - this.pixelSize / 2;
		const tmin = (this.height - (30*this.pixelSize)) / 2;

		for (var i = 0; i < 30; i++) {
			ctx.fillStyle='#aaaaaa';
			ctx.fillRect(lmin, tmin + ps*i, ps, ps);

			ctx.beginPath();
			const curMin = min/2.0;
			console.log(curMin);
			if (curMin > 30 - i) {
				ctx.fillStyle="green";
			// } else if (curHour == hour) {
				// ctx.fillStyle = 'rgb(0, ' + ((min/60) * 255) + ', 0)'
			} else {
				ctx.fillStyle="gray";
			}
			ctx.arc(lmin + ps/2, tmin + ps*i+ps/2, ps/2, 0, 2 * Math.PI, false);
			ctx.fill();
		}
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