function putDiagram(){
    $$('div.longfaq ol li')[0].insert({
        top:"<img src='./styles/images/ahp_kaeri_example.png' />"
    });
    $$('div.longfaq ol li img')[0].setStyle({
        width: 300, 
        hieght: 150, 
        cssFloat: 'right', 
        paddingLeft: 20
    });
    $$('div.longfaq ol li img')[0].observe('dblclick', function(event){
        event.element().setStyle({
            width: 600,
            hieght: 300
        });
    });
    $$('div.longfaq ol li img')[0].observe('click', function(event){
        event.element().setStyle({
            width: 300,
            hieght: 150
        });
    });
}
