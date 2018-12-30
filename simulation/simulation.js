class Clock {
	constructor(width, height, images){
		this.width = width;
		this.height = height;
	}

	drawDays(ctx) {
		// Days

		const wday = this.width / 12;
		const hday = wday;

		const lday = this.width / 4;
		const tday = (this.height - (24*hday)) / 2;

		const d = new Date();
		const hour = d.getHours();

		for (var i = 0; i < 24; i++) {
			ctx.lineWidth=0;

			// fill the background square
			ctx.fillStyle='#aaaaaa';
			ctx.fillRect(lday, tday + wday*i, wday, hday);

			// draw the light
			ctx.beginPath();

			// hour position is inverted
			const curHour = 24 - i;
			if (curHour <= hour) {
				ctx.fillStyle="red";
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
		this.drawDays(ctx);
	}
}

const clock = new Clock(300, 700, ["wood"]);

function loaded() {
	const canvas = document.getElementById("my-house");
	const ctx = canvas.getContext("2d");
	clock.draw(ctx);
}