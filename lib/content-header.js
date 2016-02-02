import BufferIo from 'buffer-io';

export async function load(buffer : EndianBuffer) {
	buffer.seekTo(0x10);
	const name = buffer.toString('utf16le', 0x20).replace(/\0/g, '');
	const description = buffer.toString('ascii', 0x80).replace(/\0/g, '');
	const author = buffer.toString('ascii', 0x0F).replace(/\0/g, '');
	
	return {
		name, description, author
	};
}
