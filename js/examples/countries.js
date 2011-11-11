function loadCountryList(element){
	var first;
	element.insert({after: '<select id="countries"></select>'});
    $('countries').setStyle({
        width: 180, 
        color: 'blue', 
        zIndex: 500, 
        overflowX: 'hidden', 
        overflowY: 'scroll', 
        clear: 'both', 
        left: ($('country').viewportOffset().left/2), 
        position: 'absolute', 
        top: ($('country').viewportOffset().top/2-3), 
        borderColor: 'gray', 
        borderWidth: 1, 
        borderStyle: 'solid', 
        padding: 2, 
        backgroundColor: 'white'
    });
    var i=0;
    countries.each(function(self){
    	$('countries').insert(('<option id="country-'+self[0]+'" class="possible">'+self[1]+'</option>'));
    });
    $$('.possible').each(function(self){
    	self.setStyle({
    		width: 180,
    		overflowX: 'hidden'
    	});
    });
    $('countries').setValue(countries.get(1));
    element.setValue($('country-1').value);
    new Form.Element.Observer('country', 0.5, function(el){
    	var re = new RegExp('.*'+el.value+'.*', 'i');
    	var firstMatch = countries.get(1);
    	var i=0;
    	countries.each(function(self){
    		firstMatch = (re.test(countries.get(i)))?countries.get(i):firstMatch;
    		i++;
    	});
    	$('countries').setValue(firstMatch);
    });
}
