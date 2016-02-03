import fs from 'fs-promise';
import {readdirSync} from 'fs';
import EndianIo from './helpers/endian-io';
readdirSync(__dirname + '/editors/')
	.filter(f => (f.indexOf('.') !== 0))
	.forEach(f => { exports[f.replace('.js', '')] = require('./editors/' + f); });

export async function load(path) {
	const blocks = [];
	const buffer : EndianIo = new EndianIo("be", await fs.readFile(path));
	
	while(true) {
		const magic = buffer.toString('ascii', 0x04);
		const length = buffer.readInt32();
		const data = buffer.slice(length - 0x08);
		const block = { magic, length };
		
		if (magic == "_eof")
			break;
		
		if (exports[magic] !== undefined)
			block.content = await exports[magic].load(data);

		blocks.push(block);
	}

	return blocks;
}
