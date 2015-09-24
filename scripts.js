var divs = [
	'splashmenu',
	'ascvd',
	'statin_start',
	'statin_u21',
	'statin_cascvd',
	'statin_hi1',
	'statin_ldl190',
	'statin_hi2',
	'statin_a4075',
	'statin_no1',
	'statin_ldl70',
	'statin_no2',
	'statin_ascvd',
	'statin_no3',
	'statin_himod',
	'statin_mod2'
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
	document.getElementById('copyright').style.bottom='50px;';
	return false;
}

function statin_start()
{
	var age = parseInt(document.getElementById('patient_age').value);
	if(age<0)
		return show('statin_start');
	else if(age<=21)
		return show('statin_u21');
	else
		return show('statin_cascvd');
}

function calculate_statin()
{
	var age = parseInt(document.getElementById('patient_age').value);
	if(age<=21)
	{
		document.getElementById('patient_statin_recommendation').value='none';
		return false;
	}
	if(document.getElementById('patient_ascvd').value == 'y')
	{
		document.getElementById('patient_statin_recommendation').value='hi';
		return false;
	}
	var ldl = parseInt(document.getElementById('patient_ldl').value);
	if(ldl >= 190)
	{
		document.getElementById('patient_statin_recommendation').value='hi';
		return false;
	}
	if(age<40 || age>75 || ldl<70)
	{
		document.getElementById('patient_statin_recommendation').value='none';
		return false;
	}
	calculate_ascvd_risk();
	var ascvd = parseFloat(document.getElementById('patient_ascvd_risk').value);
	if(document.getElementById('patient_dm').value == 'y')
	{
		if(ascvd>=7.5)
		{
			document.getElementById('patient_statin_recommendation').value='hir';
			return false;
		}
		else
		{
			document.getElementById('patient_statin_recommendation').value='mod';
			return false;
		}
	}
	if(ascvd>=7.5)
	{
		document.getElementById('patient_statin_recommendation').value='modhi';
		return false;
	}
	if(ascvd>=5)
	{
		document.getElementById('patient_statin_recommendation').value='modr';
		return false;
	}
	document.getElementById('patient_statin_recommendation').value='none';
	return false;
}

function calculate_ascvd_risk()
{
	var age = parseInt(document.getElementById('patient_age').value);
	if(age<20 || age>79)
	{
		document.getElementById('patient_ascvd_risk').value='0';
		return false;
	}
	var tc = parseInt(document.getElementById('patient_tc').value);
	if(tc<20 || tc>1000)
	{
		document.getElementById('patient_ascvd_risk').value='0';
		return false;
	}
	var hdl = parseInt(document.getElementById('patient_hdl').value);
	if(hdl<1 || hdl>200)
	{
		document.getElementById('patient_ascvd_risk').value='0';
		return false;
	}
	var sbp = parseInt(document.getElementById('patient_sbp').value);
	if(sbp<30 || sbp>300)
	{
		document.getElementById('patient_ascvd_risk').value='0';
		return false;
	}
	var bpmed = document.getElementById('patient_bpmed').value;
	var smoke = document.getElementById('patient_smoke').value;
	var dm = document.getElementById('patient_dm').value;
	var gender = document.getElementById('patient_gender').value;
	var race = document.getElementById('patient_race').value;
	if(gender=='f' && race!='b')
		var coefs=[-29.799, 4.884, 13.540, -3.114, -13.578, 3.149, 2.019, 0, 1.957, 0, 7.574, -1.665, 0.661, -29.18, 0.9665];
	else if(gender=='f' && race=='b')
		var coefs=[17.114, 0, 0.940, 0, -18.920, 4.475, 29.291, -6.432, 27.820, -6.087, 0.691, 0, 0.874, 86.61, 0.9533];
	else if(race != 'b')
		var coefs=[12.344, 0, 11.853, -2.664, -7.990, 1.769, 1.797, 0, 1.764, 0, 7.837, -1.795, 0.658, 61.18, 0.9144];
	else
		var coefs=[2.469, 0, 0.302, 0, -0.307, 0, 1.916, 0, 1.809, 0, 0.549, 0, 0.645, 19.54, 0.8954];
	coefs[0]*= Math.log(age);
	coefs[1]*= Math.pow(Math.log(age),2);
	coefs[2]*= Math.log(tc);
	coefs[3]*= Math.log(age)*Math.log(tc);
	coefs[4]*= Math.log(hdl);
	coefs[5]*= Math.log(age)*Math.log(hdl);
	if(bpmed=='y')
	{
		coefs[6]*= Math.log(sbp);
		coefs[7]*= Math.log(age)*Math.log(sbp);
		coefs[8] = coefs[9] = 0;
	}
	else
	{
		coefs[6] = coefs[7] = 0;
		coefs[8]*= Math.log(sbp);
		coefs[9]*= Math.log(age)*Math.log(sbp);
	}
	if(smoke == 'n')
	{
		coefs[10] = 0;
		coefs[11] = 0;
	}
	else coefs[11]*= Math.log(age);
	if(dm == 'n') coefs[12] = 0;
	var sum = coefs[0]+coefs[1]+coefs[2]+coefs[3]+coefs[4]+coefs[5]+coefs[6]+coefs[7]+coefs[8]+coefs[9]+coefs[10]+coefs[11]+coefs[12];
	risk = 1 - Math.pow(coefs[14], Math.exp(sum-coefs[13]));
	document.getElementById('patient_ascvd_risk').value=Math.round(risk*1000)/10;
	return false;
}