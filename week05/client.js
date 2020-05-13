const net = require('net');

const client = net.createConnection({port: 8088, host: '127.0.0.1'}, () => {

	let req = new Request({
		method: 'GET',
		host: '127.0.0.1',
		port: 8088,
		headers: {
			'X-Foo2': 'zgl'
		},
		body: {
			name: 'zgl'
		}
	});
	req.send().then(data => {
		// console.log(data);
	});
	console.log('conn to server');
});

client.on('data', data => {
	// console.log(data.toString());
	client.end();
});

client.on('end', () => {
	console.log('disconn from server');
});


class Request {
	// method url = host + port + path
	// body k/v
	// headers

	constructor(options) {
		this.method = options.method || 'GET';
		this.host = options.host;
		this.port = options.port || 80;
		this.path = options.path || '/';
		this.body = options.body || {};
		this.headers = options.headers || {};

		if (!this.headers['Content-Type']) {
			this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		if (this.headers['Content-type'] === 'application/json') {
			this.bodyText = JSON.stringify(this.body);
		} else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
			this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
		}

		this.headers['Content-Length'] = this.bodyText.length;
	}

	toString() {
		return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}`
	}

	send(conn) {
		return new Promise((resolve, reject) => {
			const parser = new ResponseParser();

			if (conn) {
				conn.write(this.toString());
			} else {
				conn = net.createConnection({
					host: this.host,
					port: this.port
				}, () => {
					conn.write(this.toString());
				})

				conn.on('data', data => {
					parser.receive(data.toString());
					if (parser.isFinished) {
						resolve(parser.res);
					}
					conn.end();
				});
				conn.on('error', err => {
					reject(err);
					conn.end();
				})
			}
		})
	}

}


class Response {

}


// HTTP/1.1 200 OK
// Content-Type: text/html
// Content-Type: text/html
// Content-Type: text/html

// Date: Mon, 23 Dec 2019 06:46:19 GMT Connection: keep-alive Transfer-Encoding: chunked
// 26
// <html><body> Hello World<body></html> 26
// <html><body> Hello World<body></html> 0


// 状态机 解析response
class ResponseParser {

	constructor() {
		this.WAITING_STATUS_LINE = 0;
		this.WAITING_STATUS_LINE_END = 1;

		this.WAITING_HEADER_NAME = 2;
		this.WAITING_HEADER_SPACE = 3;
		this.WAITING_HEADER_VALUE = 4;
		this.WAITING_HEADER_LINE_END = 5;
		this.WAITING_HEADER_BLOCK_END = 6;
		this.WAITING_BODY = 7;

		this.current = this.WAITING_STATUS_LINE;
		this.statusLine = '';
		this.headers = {};
		this.headerName = "";
		this.headerValue = "";
		this.bodyParser = null;
	}

	get isFinished() {
		return this.bodyParser && this.bodyParser.isFinished;
	}

	get res() {
		return this.statusLine.match()
	}

	receive(str) {
		// console.log('data', str);
		for (let i = 0; i < str.length; i++) {
			this.receiveChar(str.charAt(i));
		}
	}

	receiveChar(char) {
		if (this.current === this.WAITING_STATUS_LINE) {
			if (char === '\r') {
				this.current = this.WAITING_STATUS_LINE_END;
				return;
			}
			this.statusLine += char;
		} else if (this.current === this.WAITING_STATUS_LINE_END) {
			if (char === '\n') {
				this.current = this.WAITING_HEADER_NAME;
				return;
			}
		} else if (this.current === this.WAITING_HEADER_NAME) {
			if (char === ':') {
				this.current = this.WAITING_HEADER_SPACE;
				return;
			} else if (char === '\r') {
				this.current = this.WAITING_HEADER_BLOCK_END
			}
			this.headerName += char;
			// console.log(this.headerName);
		} else if (this.current === this.WAITING_HEADER_SPACE) {
			if (char === ' ') {
				this.current = this.WAITING_HEADER_VALUE;
				return;
			}
		} else if (this.current === this.WAITING_HEADER_VALUE) {
			if (char === '\r') {
				this.current = this.WAITING_HEADER_LINE_END;
				this.headers[this.headerName] = this.headerValue;
				this.headerName = '';
				this.headerValue = '';
				return;
			}
			this.headerValue += char;
		} else if (this.current === this.WAITING_HEADER_LINE_END) {
			if (char === '\n') {
				this.current = this.WAITING_HEADER_NAME;
			}
		} else if (this.current === this.WAITING_HEADER_BLOCK_END) {
			if (char === '\n') {
				this.current = this.WAITING_BODY;
			}
			if (this.headers['Transfer-Encoding'] === 'chunked') {
				this.bodyParser = new TrunckedBodyParser();
			}
		} else if (this.current === this.WAITING_BODY) {
			this.bodyParser.receiveChar(char);
		} 
	}

}

class TrunckedBodyParser {

	constructor() {
		this.WAITING_LENGTH = 0;
		this.WAITING_LENGTH_END = 1;
		this.READING_TRUNK = 2;
		this.WAITING_NEW_LINE = 3;
		this.WAITING_NEW_LINE_END = 4;

		this.length = 0;
		this.content = [];
		this.current = this.WAITING_LENGTH;

		this.isFinished = false;
	}

	receiveChar(char) {
		// console.log(JSON.stringify(char));
		if (this.current === this.WAITING_LENGTH) {
			if (char === '\r') {
				this.current = this.WAITING_LENGTH_END;
				if (this.length === 0) {
					this.isFinished = true;
					console.log(this.content);
				}
			} else {
				this.length *= 10;
				this.length += char.charCodeAt(0) - '0'.charCodeAt(0);
			}
		} else if (this.current === this.WAITING_LENGTH_END) {
			if (char === '\n') {
				this.current = this.READING_TRUNK;
			}
		} else if (this.current === this.READING_TRUNK) {
			this.content.push(char);
			this.length--;
			if (this.length === 0) {
				this.current = this.WAITING_NEW_LINE;
			}
		} else if (this.current === this.WAITING_NEW_LINE) {
			if (char === '\r') {
				this.current = this.WAITING_NEW_LINE_END;
			}
		} else if (this.current === this.WAITING_NEW_LINE_END) {
			if (char === '\n') {
				this.current = this.WAITING_LENGTH;
			}
		}
	}

}