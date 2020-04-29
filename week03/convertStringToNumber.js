// TODO 超过10进制如何处理
function convertStringToNumber(string, x) {
	let chars = string.split('');
	let number = 0;
	let i = 0;
	while (i < chars.length && chars[i] !== '.') {
		number = number * x;
		number += chars[i].codePointAt(0) - '0'.codePointAt(0);
		i++;
	}
	if (chars[i] === '.') {
		i++;
	}
	let fraction = 1;
	while (i < chars.length) {
		fraction = fraction / x;
		number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
		i++;
	}
	return number;
}



