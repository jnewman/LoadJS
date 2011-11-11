var data;
var response;
var countFunction; //Set this inside the init function
var isExplorer;
var toolTip=false;

function init(){
    observation();
    preload();
    var explorer = /MSIE/g;
    if(explorer.test(navigator.userAgent)){
        isExplorer = true;
        iestyle();
    }
    if($$('a.logo')[0]){
    	$$('a.logo')[0].setStyle({
	    	border:0, 
	    	textDecoration: '', 
	    	color: 'transparent'
    	});
    }
    if($('comeback')){
    	$('comeback').hide();
    }
    if($(document.body).hasClassName('welcome') && getGetArgument('c') == 1){
			$('advance').scrollTo();
			$('advance').focus();
	}
}

function observation(){
	if($('confirm')){
		$('confirm').observe('click', confirmation);
	}
    if($('logout')){
    	$('logout').observe('click', logout);
    }
    $('wrapper').observe('click', catchClickTimes);
    $$('a').each(function(element){
        element.observe('focus', function(event){
        	var el = event.element();
        	var title = ($(el).getAttribute('title'))?
        			$(el).getAttribute('title'):'None';
			if(toolTip){if($$('div.tip')[0]){$$('div.tip')[0].remove();}}
			if(title != 'None'){
                toolTip = true;
                $('content').insert('<div class="tip">'+title+'</div>');
                $$('div.tip')[0].setStyle({
                	position: 'absolute',
                	top: el.viewportOffset().top+10,
                	left: el.viewportOffset().left-20
                });
            }
        });
    });
    $(document.body).observe('click', function(event){
    	if(toolTip){if($$('div.tip')[0]){$$('div.tip')[0].remove();}}
    	toolTip = false;
    });
}

function confirmation(event){
	if(event.element().hasClassName('maxed')){
		loading();
		data = {
		    'confirm':'yes'
		};
		try{
			var aide = aid; //I have no idea why IE is not figuring this out.
		}catch(error){
			var aide = 1;
		}
		var _activate = getActivityById(aide);
        placeRequest(_activate, data);
	}else{
		var needed = (max-countFunction()).toString();
		var text = "Please select " + needed + " more option(s).";
		alert(text);
	}
}

function rate_init(){
	(counter == max)?activateButton(1):activateButton(0);
	countFunction = countRatings;
	document.observe('click', function(event){
	    var element = Event.element(event);
	    if (element.hasClassName('compatible') ||
            element.hasClassName('choice')){
    		var repeat = Object.isElement(getParentByClassName(element, 'repeat'));
	        var parent = getParentByClassName(element, 'ratingRow');
	        var cell = (element.hasClassName('compatible'))?element:
                $(element.childElements()[0]);
	        data = {
	    		'crid'      :parent.id.split('-')[0].replace('r', ''), 
	    		'coid'      :parent.id.split('-')[1], 
	    		'rating'    :cell.innerHTML,
	    		'uid'       :uid,
                'pop'       :'stay',
			    'repeat'    :repeat,
			    'confirm'   :'no',
			    'elapsed'   :stopWatch,
			    'clickCount':clickCounter
			};
	        postRequest('rate', data);
	        setBooleanClassName(parent, element.parentNode);
	    }
	    (countRatings() == max)?activateButton(1):activateButton(0);
	});
}

function compare_init(){
    //Very similar to rate, so changes needed in rate_init will probably be needed here.
	(counter == max)?activateButton(1):activateButton(0);
	countFunction = countComparisons;
    document.observe('click', function(event){
        var element = Event.element(event);
        if(element.hasClassName('compatible') ||
            element.hasClassName('choice')){
            var cell = (element.hasClassName('compatible'))?$(element.parentNode):
                element;
            fid = (fid)?fid:0;
            data = {
                'cell'      :cell.id, //All this is worked out server side.
                'uid'       :uid,
                'fid'       :fid,
                'pop'       :'stay',
			    'confirm'   :'no',
			    'elapsed'   :stopWatch,
			    'clickCount':clickCounter
            };
            var parent = cell.parentNode;
            postRequest('compare', data);
            setBooleanClassName(parent, element.parentNode);
        }
        (countComparisons() == max)?activateButton(1):activateButton(0);
    });
}

function select_init(){
	(counter == max)?activateButton(1):activateButton(0);
	countFunction = countSelections;
	document.observe('click', function(event){
		var element = Event.element(event);
        if(element.hasClassName('compatible') ||
            element.hasClassName('choice')){
        	var anchor = (element.hasClassName('compatible'))?
        			element:element.childElements()[0];
            var cell = $(anchor.parentNode);
            var cid = anchor.id.replace(/[A-z]+/g, '');
            if(cell.hasClassName('false')){
            	if(counter==max){return false;}
                data = {
                    'cid'       :cid,
                    'uid'       :uid,
                    'fid'       :fid,
                    'value'     :'true',
                    'pop'       :'stay',
    			    'confirm'   :'no',
    			    'elapsed'   :stopWatch,
    			    'clickCount':clickCounter
                };
                postRequest('select', data);
                cell.removeClassName('false');
                cell.addClassName('true');
                counter++;
            }else{
                data = {
            		'cid'       :cid,
                    'uid'       :uid,
                    'fid'       :fid,
                    'value'     :'false',
                    'pop'       :'stay',
    			    'confirm'   :'no',
    			    'elapsed'   :stopWatch,
    			    'clickCount':clickCounter
                };
                postRequest('select', data);
                cell.removeClassName('true');
                cell.addClassName('false');
                counter--;
            }
        }
        (counter == max)?activateButton(1):activateButton(0);
    });
}

function basic_init(){
	$('submit').observe('click', sendDemography);
	Event.observe('putUser', 'submit', function(event) {
		Event.stop(event);
	});
}

function sendDemography(){
	var otid = parseInt($('orgType').getValue());
	var cid = parseInt($('countries').getValue());
	var other = $('other').getValue(); 
	var specs = $H({
		'uid'  : uid,
		'otid' : otid,
		'cid'  : cid,
		'other': other
	}).toJSON();
	loading();
	new Ajax.Request('./php/scripts/demography.php', {
        parameters: {
            args: specs
        },
        onSuccess: function(transport) {
            response = transport.responseText;
            window.location = ".";
        }
    });
}

function postRequest(act, specifics){
    var specs = $H(specifics).toJSON();
    new Ajax.Request('./php/scripts/switchboard.php', {
        parameters: {
            action: (act)?act:'',
            args: specs
        },
        onSuccess: function(transport) {
            response = transport.responseText;
        }
    });
    return null;
}

function placeRequest(act, specifics){
    var specs = $H(specifics).toJSON();
    new Ajax.Request('./php/scripts/switchboard.php', {
        parameters: {
            action: (act)?act:'',
            args: specs
        },
        onSuccess: function(transport) {
        	var newL = ".";
			window.location=newL;
        }
    });
    return null;
}

function getParentByClassName(element, classname){
    /*
    *	Yields the first HTML element that has the given class name.
    *   If none found yields null.
    */
    for(var i=0;i<element.ancestors().length;i++){
        if(!element.ancestors()[i].hasClassName(classname)){
            continue;
        }else{
            return element.ancestors()[i];
        }
    }
    return null;
}

function setBooleanClassName(rowObject, cellSelected){
	var children = $(rowObject).childElements();
	for(var i=0;i<children.length;i++){
		children[i].removeClassName('true');
	}
	cellSelected.addClassName('true');
}

//Set preloaded images display to block, then back to none, so they are loaded.
function preload(){
    var preloaded = $$("img.preload");
    for(var i = 0; i < preloaded.length; i++){
        preloaded[i].setStyle({
            display: 'block'
        });
    }
    for(var i = 0; i < preloaded.length; i++){
        preloaded[i].setStyle({
            display: 'none'
        });
    }
    return "Success";
}

function countComparisons(){
	/*
	 * Count the number of comparisons made using the className assigned by 
	 * compare_init
	 * @params void
	 * @return int count
	 */
	var counter = 0;
	var compRows = $$('table.entry tbody tr'); 
	for(var i=0;i<compRows.length;i++){
		var cells = compRows[i].childElements();
		for(var j=0;j<cells.length;j++){
			if(cells[j].hasClassName('true')){
				counter++;
				break;
			}
		}
	}
	return counter;
}

function countRatings(){
	/*
	 * Count the number of rartings made using the className assigned by 
	 * rate_init
	 * @params void
	 * @return int count
	 */
	var counter = 0;
	var compTables = $$('table.entry');
	for(var i=0;i<compTables.length;i++){
		//I know these only have a tbody.
		var rows = compTables[i].childElements()[0].childElements();
		for(var j=0;j<rows.length;j++){
			var cells = rows[j].childElements();
			for(var k=0;k<cells.length;k++){
				if(cells[k].hasClassName('true')){
					counter++;
					break;
				}
			}
		}
	}
	return counter;
}

function countSelections(){
	return counter;
}

function activateButton(bool){
	if(bool<1){
			$('confirm').removeClassName('maxed');
			$('confirm').addClassName('notmaxed');
	}else{
			$('confirm').removeClassName('notmaxed');
			$('confirm').addClassName('maxed');
	}
	return "Success";
}

function getActivityById(aid){
	/*
	 * These are all known and hard set values, just hiding clutter.
	 */
	if(aid == 1){
		return 'select';
	}else if(aid == 2){
		return 'compare';
	}else{
		return 'rate';
	}
}

function logout(){
	var confirmed = confirm("Do you want to logout? \n(You can always come " +
			"back later.)");
	if(confirmed){
		var elements = $('content').descendants();
		for(var i=0;i<elements.length;i++){
			if(elements[i].tagName == "TABLE"){
				elements[i].remove();
			}else{
				continue;
			}
		}
		if($("rate")){
			$("rate").remove();
		}
		$$("h2")[0].innerHTML = "Goodbye";
		$$("p.instructions")[0].innerHTML = "Thank you for participating," +
				" please return to complete the survey when you have a " +
				"chance.";
		$$("div.foot")[0].setStyle({
			top: '',
			bottom: 10
		});
		$('logout').remove();
		$('confirm').remove();
		$('status').setStyle({
			top: ($('content').getHeight()-130)
		});
		$('comeback').setStyle({
			display: 'block',
			zIndex: 500
		});
		document.stopObserving();
	}
}

function loading(){
	var img = '<div id="waiting" class="loading">';
	img += '<img src="./styles/images/ajax_load.gif" title="Please stand by." />';
	img += '</div>';
	$('content').hide();
	$('wrapper').insert(img);
	var guts = $('waiting').childElements()[0];
	guts.setStyle({
		marginLeft: ($('wrapper').getWidth()-guts.getWidth())/2,
        marignTop: ($('wrapper').getHeight()-guts.getHeight())/2
	});
	if(isExplorer){
		guts.setStyle({
			position: 'relative',
			top: 300
		});
	}
	return "Success";	
}

var _watch=0;
var _timer;
var _beginTiming = 0;
var currentTime = 0;
var lastTime = 0;
var stopWatch = 0;
var clickCounter = 0;

function catchClickTimes(event){
	var clicked = event.element();
	if(clicked.hasClassName('compatible')){
		clickCounter++;
		stopWatch = currentTime-lastTime;
		lastTime = currentTime;
		//Only does something if not started.
		beginTiming();
		return "Caught";
	}
	return false;
}

function beginTiming(){
	if(_beginTiming<1){
		_beginTiming=1;
		timer();
	}
}

function timer(){
	currentTime=_watch;
	_watch++;
	_timer=setTimeout(timer,1);
}

function getGetArgument(name){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null ){
        return "";
    }else{
        return results[1];
    }
}