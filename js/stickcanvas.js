class StickWheel {
	constructor(f, id, noDI, angle, invert) {
		this.f = f;
		this.id = id;
		this.canvas = document.getElementById(id);

		this.s = 40;
		this.canvas.width = this.s;
		this.canvas.height = this.s;
		this.center = { x: this.s / 2, y: this.s / 2 };
		this.r = 15;
		this.r2 = 19;
		this.h = 2;

		this.invert = invert;

		this.clickActive = false;

		var stickWheel = this;

		this.mouseEvent = function (e) {
			if (!stickWheel.clickActive)
				return;

			var rect = stickWheel.canvas.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;

			var angle = Math.atan2(stickWheel.center.y - y, x - stickWheel.center.x) * 180 / Math.PI;
			if (angle < 0) {
				angle += 360;
			}

			if (stickWheel.invert) {
				angle = InvertXAngle(angle);
			}

			stickWheel.f(Math.floor(angle));
		}

		this.canvas.addEventListener('mousedown', function (e) {
			stickWheel.clickActive = true;
		}, false);
		this.canvas.addEventListener('mousemove', this.mouseEvent, false);
		this.canvas.addEventListener('mouseup', function (e) {
			stickWheel.clickActive = false;
		}, false);
		this.canvas.addEventListener('mouseleave', function (e) {
			stickWheel.clickActive = false;
		}, false);

		this.drawStick = function (noDI, angle, invert) {
			var context = this.canvas.getContext("2d");

			this.invert = invert;
			
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			
			context.beginPath();
			context.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
			context.closePath();
			context.stroke();
			if (noDI) {
				context.globalCompositeOperation = 'destination-out';
				context.beginPath();
				context.arc(this.center.x, this.center.y, this.r2 / 1.75, 0, 2 * Math.PI);
				context.closePath();
				context.fill();
				context.globalCompositeOperation = 'source-over';
				context.beginPath();
				context.arc(this.center.x, this.center.y, this.r2 / 1.75, 0, 2 * Math.PI);
				context.closePath();
				context.stroke();
				context.globalCompositeOperation = 'destination-out';
				context.beginPath();
				context.arc(this.center.x, this.center.y, this.r2 / 2.5, 0, 2 * Math.PI);
				context.closePath();
				context.fill();
				context.globalCompositeOperation = 'source-over';
				context.beginPath();
				context.arc(this.center.x, this.center.y, this.r2 / 2.5, 0, 2 * Math.PI);
				context.closePath();
				context.stroke();
				context.globalCompositeOperation = 'destination-out';
				context.beginPath();
				context.arc(this.center.x, this.center.y, this.r2 / 4, 0, 2 * Math.PI);
				context.closePath();
				context.fill();
				context.globalCompositeOperation = 'source-over';
				context.beginPath();
				context.arc(this.center.x, this.center.y, this.r2 / 4, 0, 2 * Math.PI);
				context.closePath();
				context.stroke();
			}
			else {
				if (invert) {
					angle = InvertXAngle(angle);
				}
				context.globalCompositeOperation = 'destination-out';
				context.beginPath();
				context.arc(this.center.x + (this.r / this.h * Math.cos(angle * Math.PI / 180)), this.center.y + (-this.r / this.h * Math.sin(angle * Math.PI / 180)), this.r2 / 1.75, 0, 2 * Math.PI);
				context.closePath();
				context.fill();
				context.globalCompositeOperation = 'source-over';
				context.beginPath();
				context.arc(this.center.x + (this.r / this.h * Math.cos(angle * Math.PI / 180)), this.center.y + (-this.r / this.h * Math.sin(angle * Math.PI / 180)), this.r2 / 1.75, 0, 2 * Math.PI);
				context.closePath();
				context.stroke();
				context.globalCompositeOperation = 'destination-out';
				context.beginPath();
				context.arc(this.center.x + (this.r / this.h * Math.cos(angle * Math.PI / 180)), this.center.y + (-this.r / this.h * Math.sin(angle * Math.PI / 180)), this.r2 / 2.5, 0, 2 * Math.PI);
				context.closePath();
				context.fill();
				context.globalCompositeOperation = 'source-over';
				context.beginPath();
				context.arc(this.center.x + (this.r / this.h * Math.cos(angle * Math.PI / 180)), this.center.y + (-this.r / this.h * Math.sin(angle * Math.PI / 180)), this.r2 / 2.5, 0, 2 * Math.PI);
				context.closePath();
				context.stroke();
				context.globalCompositeOperation = 'destination-out';
				context.beginPath();
				context.arc(this.center.x + (this.r / this.h * Math.cos(angle * Math.PI / 180)), this.center.y + (-this.r / this.h * Math.sin(angle * Math.PI / 180)), this.r2 / 4, 0, 2 * Math.PI);
				context.closePath();
				context.fill();
				context.globalCompositeOperation = 'source-over';
				context.beginPath();
				context.arc(this.center.x + (this.r / this.h * Math.cos(angle * Math.PI / 180)), this.center.y + (-this.r / this.h * Math.sin(angle * Math.PI / 180)), this.r2 / 4, 0, 2 * Math.PI);
				context.closePath();
				context.stroke();
			}
		}

		this.drawStick(noDI, angle, invert);
		
	}

	
}

