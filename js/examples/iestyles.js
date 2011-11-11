/*
* Repair the page styling for Internet Explorer < 9. 
*/

var resizeTimeoutId;

function iestyle(){
    fit();
    Event.observe(document.onresize ? document : window, "resize", fit); 
    return "Styled."
}

function fit(){
    var _height = ($('content').getHeight()<500)?500:$('content').getHeight();
    $('content').setStyle({height: _height});
    $('backgrounds').setStyle({
        height: _height*1.05
    });
    if($$('div.foot')[0] && $$('body')[0].hasClassName('goodbye')){
        $$('div.foot')[0].setStyle({
            position: 'absolute',
            width: '70%',
            top: _height*.9,
            marginTop: 0
        });
    }
    if($('putUser')){
		$('putUser').setStyle({
			position: 'static', 
			marginLeft:($('wrapper').getWidth()-$('putUser').getWidth())/2-40, 
			top: 0
		});
		var elements = $$('div.selectBox select');
		elements.push($$('div.selectBox input')[0]);
		elements.each(function(element){
			$(element).setStyle({
				position: 'relative',
				top: '-1.8em'
			});
		});
    }
}
