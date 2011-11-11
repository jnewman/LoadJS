$(window).load(function () {
	toggles('a.toggle');
});

var _offset = 0;
var _spaces = 0;

function toggles(selector){
	/*
	 * @param String selector a jQuery Selector to match.
	 * 
	 * Create element toggles that by jQuery selector that hide/show the 
	 * previous element(s). 
	 */
	$(selector).styleToggles();
	$($('hr')[0]).height('1px');
	$(selector).toggle(
		function(){
			$(this)._hide();
		}, function(){
			$(this)._show(selector);
		}
	);
	$(selector).each(function(){
		$(this).after(
			$('<div/>')
			.addClass($(this).attr('class'))
			.height($(this).height())
			.offset($(this).offset())
		);
	});
	$(selector).click();
}

jQuery.fn.styleToggles = function(){
	/*
	 * Make sure the toggles line up in a row.
	 * 
	 * @param selector the css selector of the elements that will be used 
	 * as toggles.
	 * 
	 */
	var self = $(this);
	_offset = self.offset().left;
	self.each(function(index){
	    $(this).text(
    		$(this).text()+' '+
    		$(this).prev().attr('id')
		);
	    try{
	    	_offset += $(self[index-1]).width()+75;
	    	_spaces += $(this).height();
	    	$(this).offset({left: _offset});
	    	$($(this).prev()).offset({
	    		top: $($(this).prev()).offset().top-_spaces
    		});
	    }catch(exception){
	    	null;
	    }
	});
}

jQuery.fn._hide=function(){
	$(this).each(function(){
	    $(this).text(
    		'Show '+$(this).prev().attr('id')
		);
		$(this).next().width($(this).width());
	});
	$(this).prev().hide(200);
}

jQuery.fn._show = function(bundle){
	$(bundle).each(function(){
		if($(this).prev().css('display') != "none"){
			$(this).click();
		}
	});
	$(this).prev().show(400);
	$(this).each(function(){
	    $(this).text(
    		'Hide '+$(this).prev().attr('id')
		);
		$(this).next().width($(this).width());
	});
}

jQuery.fn.title = function(glue){
	/*
	 * Reformat of--->
	 * Title Caps
	 * 
	 * Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
	 * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
	 * License: http://www.opensource.org/licenses/mit-license.php
	 * <---
	 */
	var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
	var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";
	$(this).each(function(){
		$(this).text(function(){
			var title = $(this).text();
			var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;
				
			while(true){
				var m = split.exec(title);

				parts.push( title.substring(index, m ? m.index : title.length)
					.replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
						return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
					})
					.replace(RegExp("\\b" + small + "\\b", "ig"), lower)
					.replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
						return punct + upper(word);
					})
					.replace(RegExp("\\b" + small + punct + "$", "ig"), upper));
				
				index = split.lastIndex;
				
				if(m) parts.push(m[0]);
				else break;
			}
			
			return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
				.replace(/(['Õ])S\b/ig, "$1s")
				.replace(/\b(AT&T|Q&A)\b/ig, function(all){
					return all.toUpperCase();
				});
		    
			function lower(word){
				return word.toLowerCase();
			}
		    
			function upper(word){
			  return word.substr(0,1).toUpperCase() + word.substr(1);
			}
		});
	});
}
