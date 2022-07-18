            var mymap; 
            var lyrOSM; // Background padrão do leaflet poderia ser outro...
            var ctlEasyButton;
            var ctlSidebar;
            var minimap;
            var landesri;
            var baseLayers;
            var objOverLays;
            var drone;
            var tumulos;
            var styletumulos;
            var processtumulos;
            var filtertumulos;
            var drone_mini;
            var ruas;
            var lyrSearch;
            var artumulosids = [];
            var artumulosnames = [];
            var artumulos_faleicdos = [];
            var artumulos_faleicdos2 = [];
            var search = [];

            $(document).ready(function(){
                                
                    /// ******* Inicialização do Mapa ****** 
                
                    mymap = L.map('mapdiv', {center:[-21.7106169,-46.8267380], zoom:19, zoomControl:true, maxZoom: 23,
                    minZoom: 19, fullscreenControl: true, fullscreenControlOptions: {
                    position: 'topright'
                    },
                    maxBounds: [
                            //south west
                            [-21.711594417103647, -46.82773330485791], 
                            //north east
                            [-21.709668561886637, -46.825892001070585]  
                            ],                          
                                         });

                    /// ******* Layers do Mapa ********
                    lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik',{maxNativeZoom: 19, maxZoom: 23,});
                    landesri = L.tileLayer.provider('Esri.WorldImagery');
 
                    drone = L.imageOverlay('img/drone2.png',[[-21.70983548137554, -46.8275536418],[-21.711427499655034, -46.8260716641]],{opacity:1}).addTo(mymap);
                    
                    drone_mini = L.imageOverlay('img/drone2.png',[[-21.70983548137554, -46.8275536418],[-21.711427499655034, -46.8260716641]],{opacity:1,minZoom:19, maxZoom:21 });

                    tumulos = L.geoJSON.ajax('data/tumulos.geojson',{style:styletumulos, onEachFeature:processtumulos, filter:filtertumulos, opacity:1.0,weight:0.3,fillOpacity:0.5, 	attribution: '&copy; <a href="https://www.linkedin.com/in/engleandropereira/" target="_blank">Leandro Pereira'
                    }).addTo(mymap);
                
                    tumulos.on('data:loaded', function(){
                        artumulosids.sort(function(a,b){return a-b});
                        $("#txtfindtumulo").autocomplete({
                             source: function(request, response){
                                 var results = $.ui.autocomplete.filter(search, request.term);
                                 response(results.slice(0,10));
                             }
                            
                        });

                    });
                    
                    ruas = L.geoJSON.ajax('data/ruas.geojson',{dashArray:"3", color:'red', weight: 1.5});
                
//                    tumulos.bindTooltip(function(tumulos){
//                    return 'N° ' + '<b>'+tumulos.feature.properties.numero+'</b>';
//                    }).addTo(mymap);
                    tumulos.bindPopup(function(tumulos){
                        var popup = '<div id=pop>'+'Proprietário: '+ '<b>'+tumulos.feature.properties.nome_prop+'</b>'+'<br>'+
                        'Código: ' + tumulos.feature.properties.cod_prop+ '<br>'+'Número do Túmulo: '+tumulos.feature.properties.numero+ 
                        '<table class="table table-striped"><tr> <th>Falecidos</th>     <th>Data</th></tr>   <tr>     <td>'+tumulos.feature.properties.falecidos_1+'</td>     <td>'+tumulos.feature.properties.data_1+'</td></tr>   <tr>     <td>'+tumulos.feature.properties.falecidos_2+'</td>     <td>'+tumulos.feature.properties.data_2+'</td></tr> </table>'+'</div>'
                    
                
                        return popup;
                        
                    }).addTo(mymap);
                
                    /// ******** Setup Layers *****
                    baseLayers = {
                        
                       // "Land" : lyrimage
                    };
                    objOverLays = {
                        //"Street" : lyrOSM,
                        "Drone": drone,
                        "Tumulos": tumulos,
                        "Ruas": ruas
                    };
                
                    /// ********** Butões do Mapa ********
                    ctlEasyButton = L.easyButton('glyphicon glyphicon-transfer',function(){
                         ctlSidebar.toggle();
                         
                    }).addTo(mymap);   
                    ctlEasyButton.button.style.width = '60px';
                    ctlEasyButton.button.style.height = '30px';
                    ctlEasyButton.button.style.backgroundColor = 'orange';
                 
                    var ctlEasyButton1 = L.easyButton('glyphicon glyphicon-home 100%', function(){
                        mymap.setView([-21.7106169,-46.8267380], 18, {
                              "animate": true,
                              "pan": {
                                "duration": 220000
                                    }})
                    }).addTo(mymap);
                
                    tumulos.on('click', function(json, lyr){
                        //\alert(lyr);
                        
                    });
                
                    
                
                    L.control.locate({initialZoomLevel: 15}).addTo(mymap);
                    ctlSidebar = L.control.sidebar('side-bar', {closeButton: true}).addTo(mymap);
                    
                    L.control.layers(baseLayers, objOverLays).addTo(mymap); // botão de layers
   
                    /// ***** Mini Map ******    
                    minimap = new L.Control.MiniMap(drone_mini, {toggleDisplay: true, minimized:false, position:'bottomright',  
                    width:200, height:300, 
                    zoomLevelOffset:-1}).addTo(mymap);
                    
                    /// ****** Função para Mudar o Estilo dos Tumulos com Zoom ******
                    mymap.on('zoomend', function(){
                        var zoomlevel = mymap.getZoom();
                        
                        switch (zoomlevel){
                            case 23:
                                tumulos.setStyle({weight: 2, fillOpacity:0.1});
                                //teste();
                                //alert('Zoom Igual a '+zoomlevel);
                                break;
                            default:
                                tumulos.setStyle({weight: 0.3, fillOpacity:0.5});
                                //alert('Zoom Igual a '+zoomlevel);
                                break;
                        }   

                     });

                    /// ***** Definição dos Estilos para os tumulos *****
                
                     function styletumulos(json){
                                    
                                    var att = json.properties;
                                    switch (att.cod_prop){
                                        case 0:
                                            return {color:'#333333'};
                                            break;
                                        case 1:
                                            return {color:'#0066ff', fillColor:'#66a3ff'};
                                            break;
                                        default:
                                            return {color:'#2b6229'};
                                            break;

                                    }        
                                    }
    
            });
