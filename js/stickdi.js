function StickSensibilityPosition(value) {
	if (value < 24 && value > -24)
		return 0;
	if (value > 128)
		return 1;
	if (value < -128)
		return -1;
	return value / 128;
}

function StickSensibility(value) {
	if (value < 24 && value > -24)
		return 0;
	if (value > 118)
		return 1;
	if (value < -118)
		return -1;
	return value / 118;
}

function DI(stick, launchSpeed, totalLaunchSpeed) {
	if (totalLaunchSpeed < 0.00001) //There is an if on MSC but it shouldn't happen since it requires tumble for DI to work
		return Math.atan2(launchSpeed.Y, launchSpeed.X) * 180 / Math.PI;

	if (Math.abs(Math.atan2(launchSpeed.Y, launchSpeed.X)) < parameters.di) //Cannot DI if launch angle is less than DI angle change param
		return Math.atan2(launchSpeed.Y, launchSpeed.X) * 180 / Math.PI;

	var X = StickSensibility(stick.X);
	var Y = StickSensibility(stick.Y);

	var check = Y * launchSpeed.X - X * launchSpeed.Y < 0;

	var variation = Math.abs(X * launchSpeed.Y - Y * launchSpeed.X) / totalLaunchSpeed;

	var di = parameters.di * variation;

	var angle = 0;

	if (check)
		angle = (Math.atan2(launchSpeed.Y, launchSpeed.X) - di) * 180 / Math.PI;
	else
		angle = (Math.atan2(launchSpeed.Y, launchSpeed.X) + di) * 180 / Math.PI;

	if (angle < 0)
		angle += 360;

	return angle;
}

function LSI(stickY, launch_angle) {
	if (launch_angle > 65 && launch_angle < 115)
		return 1;
	if (launch_angle > 245 && launch_angle < 295)
		return 1;

	if (launch_angle > 180) {
		if (launch_angle - 180 < 9.74)
			return 1;
	} else {
		if (launch_angle < 9.74)
			return 1;
	}

	var Y = StickSensibility(stickY);
	if (Y >= 0)
		return 1 + (parameters.lsi_max - 1) * Y;
	return 1 - (1 - parameters.lsi_min) * -Y;
}

class StickWheel {
	constructor(f, id, position) {
		this.f = f;
		this.id = id;
		this.canvas = document.getElementById(id);

		this.s = 600;
		this.canvas.width = this.s;
		this.canvas.height = this.s;
		this.center = { x: this.s / 2, y: this.s / 2 };
		this.r = 250;
		this.r2 = 200;
		this.h = 15;
		this.c = 118 / 128;

		this.clickActive = false;

		var stickWheel = this;

		this.mouseEvent = function (e) {
			if (!stickWheel.clickActive)
				return;

			var rect = stickWheel.canvas.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;

			var position = { X: 0, Y: 0 };

			position.X = Math.min(Math.max(Math.floor((((x-stickWheel.center.x)) / stickWheel.r) * 118), -127), 128);
			position.Y = Math.min(Math.max(Math.floor(((( stickWheel.center.y-y)) / stickWheel.r) * 118), -127), 128);

			stickWheel.f(position);
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

		this.drawStick = function (position) {
			var context = this.canvas.getContext("2d");
			
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			context.strokeStyle = '#FF0000';

			context.beginPath();
			context.strokeRect((this.center.x - this.r), (this.center.y - this.r), this.r * 2, this.r * 2);
			context.closePath();
			context.stroke();

			context.strokeStyle = '#00FF00';

			context.beginPath();
			context.strokeRect((this.center.x - this.r), (this.center.y - this.r * 23 / 118), this.r * 2, this.r * 2 * 23 / 118);
			context.closePath();
			context.stroke();

			context.strokeStyle = '#0000FF';

			context.beginPath();
			context.strokeRect((this.center.x - this.r * 23 / 118), (this.center.y - this.r), this.r * 2 * 23 / 118, this.r * 2);
			context.closePath();
			context.stroke();

			context.strokeStyle = '#FF0000';
			
			context.beginPath();
			context.strokeRect((this.center.x - this.r * this.c), (this.center.y - this.r * this.c), this.r * 2 * this.c, this.r * 2 * this.c);
			context.closePath();
			context.stroke();

			context.strokeStyle = '#000000';

			context.globalCompositeOperation = 'destination-out';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.X)), this.center.y + (-this.r * StickSensibilityPosition(position.Y)), this.r2 / 1.75, 0, 2 * Math.PI);
			context.closePath();
			context.fill();
			context.globalCompositeOperation = 'source-over';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.X)), this.center.y + (-this.r * StickSensibilityPosition(position.Y)), this.r2 / 1.75, 0, 2 * Math.PI);
			context.closePath();
			context.stroke();
			context.globalCompositeOperation = 'destination-out';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.X)), this.center.y + (-this.r * StickSensibilityPosition(position.Y)), this.r2 / 2.5, 0, 2 * Math.PI);
			context.closePath();
			context.fill();
			context.globalCompositeOperation = 'source-over';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.X)), this.center.y + (-this.r * StickSensibilityPosition(position.Y)), this.r2 / 2.5, 0, 2 * Math.PI);
			context.closePath();
			context.stroke();
			context.globalCompositeOperation = 'destination-out';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.X)), this.center.y + (-this.r * StickSensibilityPosition(position.Y)), this.r2 / 4, 0, 2 * Math.PI);
			context.closePath();
			context.fill();
			context.globalCompositeOperation = 'source-over';
			context.beginPath();
			context.arc(this.center.x + (this.r * StickSensibilityPosition(position.X)), this.center.y + (-this.r * StickSensibilityPosition(position.Y)), this.r2 / 4, 0, 2 * Math.PI);
			context.closePath();
			context.stroke();

			context.beginPath();
			context.moveTo(this.center.x, this.center.y - this.r);
			context.lineTo(this.center.x, this.center.y + this.r);
			context.closePath();
			context.stroke();

			context.beginPath();
			context.moveTo(this.center.x - this.r, this.center.y);
			context.lineTo(this.center.x + this.r, this.center.y);
			context.closePath();
			context.stroke();

			
			context.beginPath();
			context.arc(this.center.x, this.center.y, this.r - 6, 0, 2 * Math.PI);
			context.closePath();
			context.stroke();


		}

		this.drawStick(position);
		
	}

	
}

var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {

	$scope.kb = 100;
	$scope.angle = 10;
	$scope.gravity_boost = 0;

	$scope.stick = { X: 0, Y: 0 };

	$scope.results = [];

	$scope.updateStickFromCanvas = function (stick) {
		$scope.stick = stick;
		$scope.$apply();
		$scope.updateDI();
	}

	$scope.stickDI = new StickWheel($scope.updateStickFromCanvas, 'stickCanvas', $scope.stick);

	$scope.updateDI = function () {
		$scope.stickDI.drawStick($scope.stick);
		$scope.update();
	}

	$scope.update = function () {

		var stick = $scope.stick;
		var kb = parseFloat($scope.kb);
		var angle = parseFloat($scope.angle);
		var gravity_boost = parseFloat($scope.gravity_boost);

		if (kb > 80 && Math.abs(Math.atan2((kb * 0.03 * Math.sin(angle * Math.PI / 180)) + gravity_boost, kb * 0.03 * Math.cos(angle * Math.PI / 180))) >= parameters.di) {

			var di = DI(stick, { X: kb * 0.03 * Math.cos(angle * Math.PI / 180), Y: (kb * 0.03 * Math.sin(angle * Math.PI / 180)) + gravity_boost }, kb * 0.03);

			var lsi = LSI(stick.Y, di);

			var results = [];

			results.push(new Result("Launch angle with DI", di, "", false, true));

			if (lsi != 1) {
				results.push(new Result("LSI", lsi, "", false, true));
			}

			results.push(new Result("Horizontal launch speed", (kb * 0.03 * lsi * Math.cos(di * Math.PI / 180)), "", false, true));
			results.push(new Result("Vertical launch speed", (kb * 0.03 * lsi * Math.sin(di * Math.PI / 180)), "", false, true));
			$scope.results = results;
		} else {
			$scope.results = [new Result("Impossible to DI","","",false,false)];
		}

	}

	$scope.update();
});
