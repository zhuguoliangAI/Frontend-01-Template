function convertNumberToString(number, x) {
	let integer = Math.floor(number);
	let fraction = number - integer;
	let string1 = '';
	while (integer > 0) {
		string1 = (integer % x) + string1;
		integer = Math.floor(integer / x);
	}
	let string2 = '';
	fraction = fraction * x;
	while (fraction > 0) {
		let integer2 = Math.floor(fraction);
		string2 = string2 + integer2;
		fraction = fraction - integer2;
		fraction *= 10;
	}
	if (number.toString().includes('.')) {
		console.log(string1 + '.' + string2);
	} else {
		console.log(string1);
	}
}