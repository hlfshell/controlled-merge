var clone = require('clone');

module.exports = function(){
	var self = this;
	
	var toMerge = Array.prototype.slice.call(arguments);
	if(toMerge.length == 0) throw new Error('controlled-merge must be called with at least one object');
	
	var onConflict;
	if(typeof toMerge[0] == 'function') onConflict = toMerge.shift();
	if(toMerge.length == 1){
		if(Array.isArray(toMerge[0])){
			toMerge = clone(toMerge[0]);
		} else if(typeof toMerge[0] == 'object'){
			return clone(toMerge[0]);
		} else {
			throw new Error('controlled-merge was called with only one argument. This is valid, but requires an object or array');
		}
	}
	
	var results = toMerge.shift();
	
	var iterateAndMerge = function(obj1, obj2){
		var result = clone(obj1);
		for(var attr in obj2){
			if(!result[attr]){
				result[attr] = clone(obj2[attr]);
			} else if(typeof result[attr] == 'object' && typeof obj2[attr] == 'object'){
				result[attr] = iterateAndMerge(obj1[attr], obj2[attr]);
			} else if(onConflict){
				result[attr] = onConflict(obj1[attr], obj2[attr], attr);
			} else {
				result[attr] = clone(obj2[attr]);
			}
		}
		
		return result;
	};
	
	toMerge.forEach(function(next){
		results = iterateAndMerge(results, next);
	});
	
	return results;
}