function weighted( weights ) {
	var length = weights.length;
	for (var i=1; i < length; i++) {
		weights[i] += weights[i-1];
	}

	var value = weights[length-1] * Math.random();
	for (i=0; i < length; i++) {
		if (value < weights[i]) {
			return i;
		}
	}
}