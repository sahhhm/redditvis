/**
 * Object representing a redditor and 
 * related important information
 */
function Redditor()
{
    this.username = "";
    this.comments = new Array();
	this.comments_after = "";
	this.submitted = new Array();
	this.submitted_after = "";
	this.debug = true;
}

/**
 * A function to format an epoch datetime
 * @param utc - an integer representing a utc time
 * @returns - the desired date representation
 */
function format_date(utc) {
	var d = new Date(utc * 1000);
	return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
}