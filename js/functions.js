

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