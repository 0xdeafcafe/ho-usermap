import {readdirSync} from 'fs';
readdirSync(__dirname)
	.filter(f => (f.indexOf('.') !== 0) && (f !== 'index.js'))
	.forEach(f => { exports[f.replace('.js', '')] = require('./' + f); });