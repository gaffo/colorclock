Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

class Clock {
	constructor(width, height, images, minTemp, maxTemp, minWind, maxWind){
		this.width = width;
		this.height = height;
		this.pixelSize = this.height / 32;
		this.cols = 5;
		this.minTemp = minTemp;
		this.maxTemp = maxTemp;
		this.temp = 0;
		this.minWind = minWind;
		this.maxWind = maxWind;
	}

	top(column, cCells) {
		const ps = this.pixelSize;
		return (this.height - (cCells*ps)) / 2;
	}

	left(column) {
		const ps = this.pixelSize;
		return (this.width / this.cols) * (column + 1) - ps / 2;
	}

	drawBar(ctx, column, bgcolor, cells) {
		const ps = this.pixelSize;
		const top = this.top(column, cells.length);
		const left = this.left(column);

		for (var i = 0; i < cells.length; i++) {
			ctx.fillStyle = bgcolor;
			ctx.fillRect(left, top + ps * i, ps, ps);

			ctx.beginPath();
			ctx.fillStyle=cells[i];
			ctx.arc(left + ps/2, top + ps*i+ps/2, ps/2, 0, 2 * Math.PI, false);
			ctx.fill();
		}
	}

	drawTicks(ctx, column, color, cCells, tickCells, over) {
		const ps = this.pixelSize;
		const top = this.top(column, cCells);
		const left = this.left(column);
		const xBuffer = 4;
		const height = 4;

		ctx.fillStyle = color;
		tickCells.forEach(value => {
			var x = left - ps - xBuffer;
			const y = top + (value * ps) + ps / 2 - height / 2;
			var width = ps;

			if (over) {
				x += ps;
				width += xBuffer * 2;
			}

			ctx.fillRect(x, y, width, height);
		});
	}

	drawSegmentTicks(ctx, column, color, cCells, segments, over) {
		const segSize = cCells / 6;
		const tickCells = [];
		for (var i = 1; i < segments; i++) {
			tickCells.push(i * segSize);
		}
		this.drawTicks(ctx, column, color, cCells, tickCells, over);
	}

	drawMinutes(ctx) {
		const d = new Date();
		const min = d.getMinutes();
		const ps = this.pixelSize;
		const column = 1;

		const cells = [];

		for (var i = 0; i < 30; i++) {
			const curMin = min/2.0;
			if (curMin > 30 - i) {
				cells.push("green");
			} else {
				cells.push("gray");
			}
		}

		this.drawBar(ctx, column, "#aaaaaa", cells);
		this.drawSegmentTicks(ctx, column, "rgb(200,200,200)", cells.length, 6, true);
	}

	drawTemp(ctx) {
		if (this.temp == null) {
			return;
		}
		const selected = 30 - this.temp.map(this.minTemp, this.maxTemp, 0, 30);
		const cells = [];
		for (var i = 0; i < 30; i++) {
			if (i < selected) {
				cells.push("gray");
			} else {
				cells.push('blue');
			}
		}
		this.drawBar(ctx, 2, "#aaa", cells);
		this.drawSegmentTicks(ctx, 2, "rgb(200,200,200)", cells.length, 6, true);
	}

	drawWind(ctx) {
		if (this.wind == null) {
			return;
		}
		const selected = 30 - this.wind.map(this.minWind, this.maxWind, 0, 30);
		const cells = [];
		for (var i = 0; i < 30; i++) {
			if (i < selected) {
				cells.push("gray");
			} else {
				cells.push('orange');
			}
		}
		this.drawBar(ctx, 3, "#aaa", cells);
		this.drawSegmentTicks(ctx, 3, "rgb(200,200,200)", cells.length, 6, true);
	}

	drawHours(ctx) {
		// Days
		const d = new Date();
		const hour = d.getHours();
		const min = d.getMinutes();
		const column = 0;

		const cells = [];

		for (var i = 0; i < 24; i++) {
			// hour position is inverted
			const curHour = 24 - i;
			if (curHour < hour) {
				cells.push("green");
				ctx.fillStyle="green";
			} else if (curHour == hour) {
				cells.push('rgb(0, ' + ((min/60) * 255) + ', 0)');
			} else {
				cells.push("gray");
			}
		}
		this.drawBar(ctx, column, "#aaaaaa", cells);

		this.drawSegmentTicks(ctx, column, "rgb(200,200,200)", cells.length, 6, true);
	}

	draw(ctx) {
		const wood = document.getElementById("wood");

		ctx.drawImage(wood, 0, 0, this.width, this.height);
		this.drawHours(ctx);
		this.drawMinutes(ctx);
		this.drawTemp(ctx);
		this.drawWind(ctx);

		const colors = [];
		for (var i = 0; i < 30; i++) {
			colors.push("gray");
		}
	}
}

function k2f(k) {
  return k * (9/5) - 459.67;
}

const clock = new Clock(300, 700, ["wood"], 20, 90, 0, 30);

var xhr = new XMLHttpRequest();
xhr.open('GET', "http://api.openweathermap.org/data/2.5/weather?id=5809844&APPID=eba0b2940f9c54532614bebad6c2bf56", true);
xhr.responseType = 'json';
xhr.onload = function() {
  var status = xhr.status;
  if (status === 200) {
  	clock.temp = k2f(xhr.response["main"]["temp"]);
  	clock.wind = xhr.response["wind"]["speed"];
  	loaded();
  }
};
xhr.send();

function loaded() {
	const canvas = document.getElementById("my-house");
	const ctx = canvas.getContext("2d");
	clock.draw(ctx);
}