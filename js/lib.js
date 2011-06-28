/**
 * returns a string containing a desired representaiton for an epoch time
 * @param utc - an integer representing a utc time
 * @returns - the desired date representation
 */
function format_date(utc) {
	var d = new Date(utc * 1000);
	return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
}