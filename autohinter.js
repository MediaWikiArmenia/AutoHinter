function InitializeAutoHinter () {
	$( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
		'section': 'main',
		'group': 'insert',
		'tools': {
				'autoHinter': {
						label: 'Հավանական սխալների որոնում (Alt+Z)',
						type: 'button',
						icon: '//upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Oxygen480-actions-help-hint.svg/22px-Oxygen480-actions-help-hint.svg.png',
						action: {
							type: 'callback',
								execute: function(context){
									autoHint();
							}
						}
				}
		}
	} );

	
	$(document).keyup(function(evt)
	{
		if (evt.altKey && !(evt.ctrlKey)) //Left Alt under Win, Alt & no Ctrl under Lin/OS X
		{
			evt.stopPropagation();
 
			switch(evt.keyCode)
			{			
			case 90: //Alt + Z
				autoHint();
				break;
			}
 
			return false;
		}
	});

}


var autoHint = function ( isRecursiveCall ) {
	if (typeof isRecursiveCall == 'undefined') {
		isRecursiveCall = false;
	}
 
	var textarea = document.getElementById("wpTextbox1");
	var end = textarea.selectionEnd;
	var text = textarea.value;
	var firstMistakePos, firstMistake;
 
	if (!isRecursiveCall) {
			autoHintPos = end;
	}
 
	var OCRMistakes = {
						tooManyVowelsInRow:{
										pos:-1,
										regex:/[աեէիոօև]{3,}/,
										length:3,
										preoffset:0,
										postoffset:0,
										message:''},
						tooManyEvslsInRow:{
										pos:-1,
										regex:/[և]{2,}/,
										length:2,
										preoffset:0,
										postoffset:0,
										message:''},
						ViunWithoutVo:{
										pos:-1,
										regex:/[^ոՈ]ւ/,
										length:2,
										preoffset:0,
										postoffset:0,
										message:''},
						LatArmMix:{
										pos:-1,
										regex:/[ա-ֆև][a-zа-я0-9]|[a-zа-я0-9][ա-ֆև]/i,
										length:2,
										preoffset:0,
										postoffset:0,
										message:''},
						LatCapLetterswithDot:{
										pos:-1,
										regex:/[A-ZА-Я][.․]/,
										length:2,
										preoffset:0,
										postoffset:0,
										message:''},
						SuspiciousSigns:{
										pos:-1,
										regex:/[\^"\&£€~\\]/,
										length:1,
										preoffset:0,
										postoffset:0,
										message:''},
						SuspiciousSpacing:{
										pos:-1,
										regex:/\s[՛՝`՜\.․,]/,
										length:1,
										preoffset:0,
										postoffset:0,
										message:''},
						LonelyLetter:{
										pos:-1,
										regex:/\s[ա-զըժ-ֆ]\s/,
										length:1,
										preoffset:1,
										postoffset:0,
										message:''},
						Hyphenation:{
										pos:-1,
										regex:/[-–]\n/,
										length:1,
										preoffset:0,
										postoffset:1,
										message:''}
		};
 
	textPart = text.substring(autoHintPos);
 
	$.each(OCRMistakes, function( index, value ) {
		value.pos = textPart.search(value.regex);
		if (value.pos!==-1)	{
			if (typeof firstMistakePos == 'undefined') {
				firstMistakePos = value.pos;
				firstMistake = index;
			}
			else if (value.pos<firstMistakePos) {
				firstMistakePos = value.pos;
				firstMistake = index;
			}
		}
	});
 
	if (typeof firstMistakePos !== 'undefined')	{
		textarea.selectionStart = autoHintPos+firstMistakePos+OCRMistakes[firstMistake]['preoffset'];
		textarea.selectionEnd = textarea.selectionStart+OCRMistakes[firstMistake]['length']+OCRMistakes[firstMistake]['postoffset'];
		autoHintPos = textarea.selectionEnd;
 
		textarea.focus();
	}
	else if (autoHintPos!==0 && isRecursiveCall===false)	{
		autoHintPos=0;
		autoHint(true);
	}
};

InitializeAutoHinter ();
