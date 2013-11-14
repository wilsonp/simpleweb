var fs = require('fs'),
 	articles = [];
	
try{
	var data = fs.readFileSync('article.db');
	articles = JSON.parse(data).articles;
}catch(e){}

articles.create = function(data){
	var art = {
		createTime:Date.now(),
		updateTime:Date.now(),
		id:'ID-' + Date.now(),
		typeId:data.typeId,
		title:data.title,
		content:data.content,
		img:data.img?data.img.toString('base64'):''
	};
	articles.unshift(art);
}

articles.getIndex = function(id){
	var index = null;
	this.forEach(function(article,idx){
		if(id === article.id){
			index = idx;
		}
	});
	return index;
}

articles.delById = function(id){
	var index = this.getIndex(id);
	if(index !== null){
		this.splice(index,1);
	}
}

articles.delByType = function(type){
	if(type !== null){
		this.forEach(function(article,index){
			if(article.typeId === type){
				this.splice(index,1);
			}
		});
	}
}

articles.update = function(id,data){
	var index = this.getIndex(id);
	if(index !== null && data !== null){
		var article = this[index];
		article.updateTime = Date.now();
		article.typeId = data.type?data.type:article.typeId;
		article.title = data.title?data.title:article.title;
		article.content = data.content?data.content:article.content;
		article.img = data.img?data.img.toString('base64'):article.img;
	}
}

articles.has = function(type){
	var hasArticle = false;
	try{
		this.forEach(function(article){
			if(article.typeId === type){
				hasArticle = true;
				throw new Error();
			}
		});
	}catch(e){}
	return hasArticle;
}

articles.getById = function(id){
	var index = this.getIndex(id);
	var art = null;
	if(index !== null){
		art = this[index];
	}
	return art;
}

articles.getByType = function(type){
	var arts = [];
	this.forEach(function(article){
		if(article.typeId === type){
			arts.unshift(article);
		}
	});
	return arts;
}

function save(){
	fs.writeFileSync('article.db',JSON.stringify({articles:articles}));
}

setInterval(save,10 * 1000);

module.exports = articles;
