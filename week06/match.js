function match(str) {
	let state = start;
	for (const ch of str) {
		state = state(ch);
	}
	console.log(state === end);
}


function start(ch) {
	if (ch === 'a') {
		return findA;
	} else {
		return start(ch);
	}
}

function findA(ch) {
	if (ch === 'b') {
		return findB;
	} else {
		return start(ch);
	}
}

function findB(ch) {
	if (ch === 'c') {
		return end;
	} else {
		return start(ch);
	}
}

function end(ch) {
	return end;
}

match('aabc');

// TODO 作业 完成 'abab
// TODO optional KMP