var divs = [
	'splashmenu',
	'statin_start',
	'statin_u21'
];

function clear_screen()
{
	document.getElementById('menu').style.display='none';
	divs.forEach(function(item,index,array) {
		document.getElementById(item).style.display='none';
		document.getElementById(item).style.background='white';
	});
}

function show(id)
{
	clear_screen();
	document.getElementById(id).style.display='block';
	if(id != 'splashmenu')
		document.getElementById(id).style.background='#ffd';
	return false;
}