

function getShuffledArray(array)
{
	var returnArray = [];
	var tempArray = array.slice(); //clone the array
	for (var i in tempArray)
	{
		var index = g.rand.nextInt(0, tempArray.length);
		var item = tempArray[index];
		returnArray.push(item);
		tempArray.splice(index, 1);
	}
	return returnArray;
}


function find_mode(array) {
	//var arr = getShuffledArray(array);
	var arr = array;
    var mode = {};
    var max = 0, count = 0;

    arr.forEach(function(e) {
        if (mode[e]) { mode[e]++; }
        else { mode[e] = 1; }

        if (count<mode[e]) {
            max = e;
            count = mode[e];
        }
    });
   
    return max;
}


function l(string)
{
	console.log(string);
}