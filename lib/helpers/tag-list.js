import fs from 'fs-promise';

export async function load(path) {
	const file = await fs.readFile(path);
	const tags_data = file.toString().split('\n');
	const tag_list = [];
	for(var i = 0; i < tags_data.length; i++) {
		const tag_data = tags_data[i].split(',');
		tag_list.push({
			ident: parseInt(tag_data[0], 16),
			name: tag_data[1]
		});
	}
	
	return tag_list;
}