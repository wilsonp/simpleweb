var types = [],
	fs = require('fs'),
	articles = require('./articles.js');

try{
	var data = fs.readFileSync('type.db');
	types = JSON.parse(data).types;
}catch(e){}


types.getIndex = function(id){
	var index = null;
	this.forEach(function(type,idx){
		if(id === type.id){
			index = idx;
		}
	});
	return index;
}

types.create = function(title){
	var type = {
		id:'ID-' + Date.now(),
		title:title
	};
	types.unshift(type);
}

types.del = function(id){
	
	var index = this.getIndex(id);

	if(index !== null && !articles.has(id)){
		this.splice(index,1);
	}
}

types.update = function(title,id){
	var index = this.getIndex(id);
	if(index !== null && typeof title === 'string'){
		var type = this[index];
		type.title = title;
	}
}

types.get = function(id){
	var index = this.getIndex(id);
	if(index !== null){
		return this[index];
	}
	return null;
}

function save(){
	fs.writeFileSync('type.db',JSON.stringify({types:types}));
}

setInterval(save,10 * 1000);

module.exports = types;