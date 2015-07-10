module.exports = function(){
	var self = this;
	
	var toMerge = Array.prototype.slice.call(arguments);
	if(toMerge.length == 0) throw new Error('controlled-merge must be called with at least one object');
	
	var onConflict;
	if(typeof toMerge[0] == 'function') onConflict = toMerge.shift();
	if(toMerge.length == 1){
		if(Array.isArray(toMerge[0])){
			toMerge = toMerge[0];
		} else if(typeof toMerge[0] == 'object'){
			return toMerge[0];
		} else {
			throw new Error('controlled-merge was called with only one argument. This is valid, but requires an object or array');
		}
	}
	
	var results = toMerge.shift();
	
	var iterateAndMerge = function(obj1, obj2){
		for(var attr in obj2){
			if(!obj1[attr]){
				obj1[attr] = obj2[attr];
			} else if(typeof obj1[attr] == 'object' && typeof obj2[attr] == 'object'){
				obj1[attr] = iterateAndMerge(obj1[attr], obj2[attr]);
			} else if(onConflict){
				obj1[attr] = onConflict(obj1[attr], obj2[attr]);
			} else {
				obj1[attr] = obj2[attr];
			}
		}
		
		return obj1;
	};
	
	toMerge.forEach(function(next){
		results = iterateAndMerge(results, next);
	});
	
	return results;
}