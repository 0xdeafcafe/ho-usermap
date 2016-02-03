import fs from 'fs-promise';
import EndianIo from './helpers/endian-io';
import editors from './editors/';

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
		
		if (editors[magic] !== undefined)
			block.content = await editors[magic].load(data);

		blocks.push(block);
	}

	return blocks;
}
