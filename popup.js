var browseClass = ".ui-widget-content resizable";
var classTitle = $(browseClass).find("a.section-details-link");
console.log(classTitle);
var className = classTitle.prevObject.prevObject[0].children[0].innerText;
console.log(className);
var count = 0;
for (i=0; i <=15; i++){
	if (isNaN(className.substring(className.indexOf("Subject and Course Number:")+27+ i, className.indexOf("Subject and Course Number:")+27+i+1)) == false) {
		count = count + 1;
	}		
	if(count == 4){
		var major = className.substring(className.indexOf("Subject and Course Number:") + 27, className.indexOf("Subject and Course Number:")+ 27+i+1);
		break;
	}
}

// courseNum = major.substring(major.length - 4, major.length);
majorShort = major.substring(0, major.length -4);
//console.log(major);

// className = className.substring(className.indexOf("Status") + 6, className.indexOf("Lecture")).trim();
// console.log(className);

var teacherRow = classTitle.prevObject.prevObject[0].all.table1.childNodes[2];
console.log(classTitle);

var teacherNameSPA = [];

for(i=0; i<teacherRow.childNodes.length; i++) {
	teacherNameSPA[i] = teacherRow.childNodes[i].children[7].innerText;
	teacherNameSPA[i] = teacherNameSPA[i].substring(0, teacherNameSPA[i].indexOf(",") + 3);
	var className = teacherRow.childNodes[i].children[0].innerText;
	var courseNum = teacherRow.childNodes[i].children[2].innerText;
}

for(i=0;i<=className.length;i++) {
	if(className.substring(i,i+1) == ' '){
		className = className.substring(0,i) + '-' + className.substring(i+1, className.length);
	}
}
console.log(className);
if(className.search("Virtual-Campus-")) {
	className = className.replace("Virtual-Campus-","");
}
if(className.search("lab")) {
	className = className.replace("Lab","");
}
if(className.search("lecture")) {
	className = className.replace("Lecture", "");
}
console.log(className);
console.log(teacherNameSPA);
console.log(majorShort);
console.log(courseNum);
console.log(className);


var teachers = {};

$.get('https://www.koofers.com/virginia-tech-vt/' + majorShort + '/' + courseNum + '-' + className + '/' + 'professors').done(function(responseText) {
	var koofersTeachers = $.parseHTML(responseText);
	$jQueryObj = $(koofersTeachers);
	var test = $jQueryObj.find(".row  ");
	console.log(test);
	console.log(test.length);
	for(i=0;i<test.length;i++) {
		if(test[i].childNodes.length == 9) {
			var teacherName = test[i].childNodes[5].childNodes[1].innerText;
			if(teacherName.indexOf(",") != -1) {
				teacherName = teacherName.substring(0,teacherName.indexOf(",")+3);
			}			
			teachers[teacherName] = {};
			teachers[teacherName].averageGPA = test[i].childNodes[5].childNodes[3].childNodes[0].childNodes[3].innerText;
			teachers[teacherName].rating = test[i].childNodes[3].children[0].children[0].innerText;

		}
	}

	console.log(teachers);


	// var test4 = JSON.stringify(teachers);

	// console.log(test4);



	// for (i=0;i<teacherNameSPA.length;i++) {
	// 	if(test4.indexOf(teacherNameSPA[i]) != -1) {
	// 		console.log(teachers[teacherNameSPA[i]].averageGPA); //output next to teacher name
	// 		console.log(teachers[teacherNameSPA[i]].rating); // output next to teacher name
	// 	}
	// }


	const resultInstructors = $('a.email');
	resultInstructors.map(function(idx) {

		const nameParts = this.innerText.split(',');
		const lastName = nameParts[0].trim();
		const firstName = nameParts[1].trim();
		const firstInitial = firstName.substring(0, 1);
		const cleanedName = lastName + ', ' + firstInitial;

		const t = teachers[cleanedName];
		if (t) {
			const gpa = t.averageGPA;
			const rating = t.rating;
			$(this).parent().append(
				'<div class="gpa">GPA: ' + gpa + '</div>' +
				'<div class="rating">Rating:' + rating + '</div>'
			);
		}
		else {
			$(this).parent().append(
			'<div class="gpa">GPA: Not Found</div>' +
			'<div class="rating">Rating: Not Found</div>'
			);
		}
	});


	// $('a.email').parent().append('<div>' + className + '</div>');


});


$.get('https://www.koofers.com/virginia-tech-vt/' + majorShort + '/' + courseNum + '-' + className).done(function(responseText) {
	var koofersClasses = $.parseHTML(responseText, document, true);
	$jQueryObj = $(koofersClasses);
	var classGPA = $jQueryObj.find(".blue_container");
	var avgClassGPA = classGPA[0].children[2].innerText.trim();
	var avgClassGPA = avgClassGPA.substring(8,avgClassGPA.length).trim();
	var avgClassGPA = majorShort + " " + courseNum + " Average GPA: " + avgClassGPA;
	console.log(avgClassGPA);

	// var percents = $jQueryObj.find('#cif_gpa_5753 .highcharts-data-labels tspan').map(function(idx) {
	// 	debugger;
	// 	return $(this).innerHtml;
	// });

	// debugger;

	// var percents = $jQueryObj.find('.hchart_widget');
	// console.log(percents);
	// var percentA = percents[0].children[0].childNodes[0].childNodes[0].data;


	// $("body").append($('<input type="text" style="position:fixed; top:130px; z-index:1000; left:10px; width:200px;" id="eso_text" value="' + companyName + '" />'));
	$('div#breadcrumbHeader').append('<div style="position:absolute; top:10px; right:20px; ">' + avgClassGPA + '</div>');
	//$('h1').append('<div style="position:absolute; top:10px; right:20px; ">' + avgClassGPA + '</div>');

});

//$('td.footable-first-column').append('<div>' + className + '</div>');


// $('a.email').parent().append('<div>' + className + '</div>');

var data = {
	"majorShort": majorShort,
	"courseNum": courseNum
};

$.post('https://i78jah8e39.execute-api.us-east-1.amazonaws.com/prod/hello-world', JSON.stringify(data), function(responseText) {
	console.log(responseText);

	var percentA = responseText.substring(responseText.indexOf("\\\"a\\\"")+7,responseText.indexOf(",",responseText.indexOf("\\\"a\\\"")+7));
	if(isNaN(percentA) == false) {
		percentA = parseFloat(percentA).toFixed(2);
		percentA = " A%: " + percentA;
	}	
	var percentB = responseText.substring(responseText.indexOf("\\\"b\\\"")+7,responseText.indexOf(",",responseText.indexOf("\\\"b\\\"")+7));
	if(isNaN(percentB) == false) {
		percentB = parseFloat(percentB).toFixed(2);	
		percentB = " B%: " + percentB;
	}
	var percentC = responseText.substring(responseText.indexOf("\\\"c\\\"")+7,responseText.indexOf(",",responseText.indexOf("\\\"c\\\"")+7));
	if(isNaN(percentC) == false) {
		percentC = parseFloat(percentC).toFixed(2);
		percentC = " C%: " + percentC;
	}
	var percentD = responseText.substring(responseText.indexOf("\\\"d\\\"")+7,responseText.indexOf(",",responseText.indexOf("\\\"d\\\"")+7));
	if(isNaN(percentD) == false) {
		percentD = parseFloat(percentD).toFixed(2);
		percentD = " D%: " + percentD;
	}
	var percentF = responseText.substring(responseText.indexOf("\\\"f\\\"")+7,responseText.indexOf(",",responseText.indexOf("\\\"f\\\"")+7));
	if(isNaN(percentF) == false) {
		percentF = parseFloat(percentF).toFixed(2);
		percentF = " F%: " + percentF;
	}
	else {
		var percents = "NOT AVAILABLE FOR THIS CLASS."
	}	
	var percents = percentA + percentB + percentC + percentD + percentF;
	
	$('div#title-panel.aurora-theme').append('<div style="position:absolute; top:10px; right:20px; "> GRADE DISTRIBUTION ' + percents + '</div>');



	console.log(percentA);
	console.log(percentB);
	console.log(percentC);
	console.log(percentD);
	console.log(percentF);


	// var anaanuClasses = $.parseHTML(responseText);
	// $jQueryObj = $(anaanuClasses);
	// var classGPA = $jQueryObj.find(".results-row odd");
	// console.log(classGPA);
});




