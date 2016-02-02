import BufferIo from 'buffer-io';
import fs from 'fs-promise';

export async function load(buffer : EndianBuffer) {
	// switch to little endian
	buffer.endianness('le');
	
	const content = { };
	
	// load header
	buffer.seekTo(0x10);
	content.name = buffer.toString('utf16le', 0x20).replace(/\0/g, '');
	content.description = buffer.toString('ascii', 0x80).replace(/\0/g, '');
	content.author = buffer.toString('ascii', 0x0F).replace(/\0/g, '');
	
	buffer.seekTo(0x106);
	content.spawned_object_count = buffer.readInt16();
	content.map_id = buffer.readInt32();
	content.world_bounds_x = {
		min: buffer.readFloat(),
		max: buffer.readFloat()
	};
	content.world_bounds_y = {
		min: buffer.readFloat(),
		max: buffer.readFloat()
	};
	content.world_bounds_z = {
		min: buffer.readFloat(),
		max: buffer.readFloat()
	};
	
	buffer.seekTo(0x04, true);
	content.maximium_budget = buffer.readFloat();
	content.current_budget = buffer.readFloat();
	
	// load object table
	buffer.seekTo(0x08, true);
	const objects = [];
	for(let i = 0; i < 0x280; i++) {
		const object = { };
		
		object.offset = buffer.position();
		buffer.seekTo(0x0C, true);
		object.tag_entry_index = buffer.readInt32();
		object.spawn_coordinates = {
			x: buffer.readFloat(),
			y: buffer.readFloat(),
			z: buffer.readFloat()
		};
		object.spawn_position = {
			right: {
				x: buffer.readFloat(),
				y: buffer.readFloat(),
				z: buffer.readFloat()
			},
			up: {
				x: buffer.readFloat(),
				y: buffer.readFloat(),
				z: buffer.readFloat()
			}
		};
		
		buffer.seekTo(0x0A, true);
		const flagsByte = buffer.readUInt8();
		const flags = [];
		for(var j = 7; j >= 0; j--)
			flags.push(flagsByte & (1 << j) ? 1 : 0);
		object.flags = {
			place_at_start: (flags[6] == 0)
		};
		if (flags[4] == 1 &&
			flags[5] == 1)
			object.flags.symmetry = 'both';
		else if (flags[4] == 1)
			object.flags.symmetry = 'asymmetric';
		else if (flags[5] == 1)
			object.flags.symmetry = 'symmetrical';

		object.team = buffer.readUInt8();
		object.tag_specific_option = buffer.readUInt8();
		object.respawn_time = buffer.readUInt8();
		
		buffer.seekTo(0x01, true);
		object.shape_type = buffer.readUInt8();
		object.shape_size = {
			'width/depth': buffer.readFloat(),
			depth: buffer.readFloat(),
			top: buffer.readFloat(),
			bottom: buffer.readFloat(),
		};
		
		if (object.tag_entry_index == -1)
			continue;
			
		objects.push(object);
	}
	
	// load taglist
	const tags = await fs.readFile('C:\\Games\\Halo Online\\assembly\\TagNames\\tagnames_1.106708 cert_ms23.csv');
	const tag_array = tags.toString().split("\n");
	const tag_list = [];
	for(var i = 0; i < tag_array.length; i++) {
		const tag_data = tag_array[i].split(',');
		tag_list[parseInt(tag_data[0], 16)] = tag_data[1];
	}
	
	// load tag entries
	buffer.seekTo(0x20, true);
	const tag_entries = [];
	for(let i = 0; i < 0x100; i++) {
		const tag_entry = {};
		
		tag_entry.placed_objects = [];
		tag_entry.offset = buffer.position();
		tag_entry.tag_index = buffer.readInt32();
		tag_entry.tag = tag_list[tag_entry.tag_index] || -1;
		tag_entry.run_time_minimium = buffer.readUInt8();
		tag_entry.run_time_maximium = buffer.readUInt8();
		tag_entry.count_on_map = buffer.readUInt8();
		tag_entry.design_time_maximium = buffer.readUInt8();
		tag_entry.cost = buffer.readFloat();
		
		if (tag_entry.tag_index == -1)
			continue;
			
		tag_entries.push(tag_entry);
	}
	
	// link objects up
	for(let i = 0; i < objects.length; i++) {
		const object = objects[i];
		tag_entries[object.tag_entry_index].placed_objects.push(object);
	}
	
	content.sandbox_placement = tag_entries;
		
	return content;
}
