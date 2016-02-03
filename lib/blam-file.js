import fs from 'fs-promise';
import EndianIo from './helpers/endian-io';
import * as chdr from './editors/chdr';
import * as mapv from './editors/mapv';

export async function load(path) {
	const blocks = [];
	const buffer : EndianIo = new EndianIo("be", await fs.readFile(path));
	
	while(true) {
		const magic = buffer.toString('ascii', 0x04);
		const length = buffer.readInt32();
		const data = buffer.slice(length - 0x08);
		
		const block = {
			magic,
			length
		};
		
		switch (block.magic) {
			case "chdr":
				block.content = await chdr.load(data);
				break;
				
			case "mapv":
				block.content = await mapv.load(data);
				break;
		}
		
		blocks.push(block);
		
		if (block.magic == "_eof")
			break;
	}

	return blocks;
}
