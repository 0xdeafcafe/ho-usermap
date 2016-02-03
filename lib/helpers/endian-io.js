export default class EndianIo {
	constructor(endianness : string, buffer : Buffer) {
		if (endianness.toLowerCase() != 'le' &&
			endianness.toLowerCase() != 'be')
			throw Error('Invalid Endianness. Must be either "le", or "be".');
			
		this._endianness = endianness;
		this._buffer = buffer;
		this._position = 0;
	}
	
	endianness(endianness = this._endianness) {
		return (this._endianness = endianness);
	}
	
	buffer() {
		return this._buffer;
	}
	
	position() {
		return this._position;
	}
	
	length() {
		this._buffer.length;
	}
	
	seekTo(offset, fromCurrentPosition = false) {
		if (fromCurrentPosition)
		{
			if (this._position + offset > this._buffer.length)
				throw Error('New offset position is outside the bounds of the file.');
				
			this._position += offset;
		}
		else
			this._position = offset;
	}
	
	readDouble(noAssert = false) {
		let data = undefined;
		
		if (this._endianness == 'le')
			data = this._buffer.readDoubleLE(this._position, noAssert);
		else
			data = this._buffer.readDoubleBE(this._position, noAssert);
			
		this.seekTo(0x08, true);
		return data;
	}
	
	readFloat(noAssert = false) {
		let data = undefined;
		
		if (this._endianness == 'le')
			data = this._buffer.readFloatLE(this._position, noAssert);
		else
			data = this._buffer.readFloatBE(this._position, noAssert);
			
		this.seekTo(0x04, true);
		return data;
	}
	
	readInt8(noAssert = false) {
		let data = this._buffer.readInt8(this._position, noAssert);
		this.seekTo(0x01, true);
		return data;
	}
	
	readInt16(noAssert = false) {
		let data = undefined;
		
		if (this._endianness == 'le')
			data = this._buffer.readInt16LE(this._position, noAssert);
		else
			data = this._buffer.readInt16BE(this._position, noAssert);
			
		this.seekTo(0x02, true);
		return data;
	}
	
	readInt32(noAssert = false) {
		let data = undefined;
		
		if (this._endianness == 'le')
			data = this._buffer.readInt32LE(this._position, noAssert);
		else
			data = this._buffer.readInt32BE(this._position, noAssert);
			
		this.seekTo(0x04, true);
		return data;
	}
	
	readUInt8(noAssert = false) {
		let data = this._buffer.readUInt8(this._position, noAssert);
		this.seekTo(0x01, true);
		return data;
	}
	
	readUInt16(noAssert = false) {
		let data = undefined;
		
		if (this._endianness == 'le')
			data = this._buffer.readUInt16LE(this._position, noAssert);
		else
			data = this._buffer.readUInt16BE(this._position, noAssert);
			
		this.seekTo(0x02, true);
		return data;
	}
	
	readUInt32(noAssert = false) {
		let data = undefined;
		
		if (this._endianness == 'le')
			data = this._buffer.readUInt32LE(this._position, noAssert);
		else
			data = this._buffer.readUInt32BE(this._position, noAssert);
			
		this.seekTo(0x04, true);
		return data;
	}
	
	slice(length) {
		let data = this._buffer.slice(this._position, this._position + length);
		this.seekTo(length, true);
		return new EndianIo(this._endianness, data);
	}
	
	toString(encoding = 'utf8', length = this._buffer.length) {
		let data = this._buffer.toString(encoding, this._position, this._position + length);
		this.seekTo(length, true);
		return data;
	}
}
