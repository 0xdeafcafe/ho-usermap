import fs from 'fs-promise';
import BufferIo from 'buffer-io';
import * as ContentHeader from './content-header';
import * as MapVariant from './map-variant';

export async function load(path) {
	const blocks = [];
	const buffer : EndianBuffer = new BufferIo("be", await fs.readFile(path));
	
	while(true) {
		const magic = buffer.toString('ascii', 0x04);
		const length = buffer.readInt32();
		const data = buffer.slice(length - 0x08);
		
		const block = {
			magic,
			length,
			data: data.buffer()
		};
		
		switch (block.magic) {
			case "chdr":
				block.content = await ContentHeader.load(data);
				break;
				
			case "mapv":
				block.content = await MapVariant.load(data);
				break;
		}
		
		blocks.push(block);
		
		if (block.magic == "_eof")
			break;
	}

	return blocks;
}
