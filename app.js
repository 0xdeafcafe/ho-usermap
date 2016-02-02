import * as BlamFile from './lib/blam-file';
import * as util from 'util';
import * as fs from 'fs';

var blocks = BlamFile.load('C:\\Users\\alexr\\Desktop\\map.bin')
	.then(data => {
		fs.writeFile('map.json', JSON.stringify(data, null, " "));
	}, err => {
		console.error(err.stack);
	});

console.log('done.');