var Storage = function(){};

Storage.prototype.guardarDatosFormDuo = function( nomUsuario, idPartida, tipoUnion ){
    var json = {
        'nombreJugador': nomUsuario,
        'idPartida': idPartida,
        'tipoUnion': tipoUnion
    };
    var jsonStr = JSON.stringify( json );
    localStorage.setItem( 'formularioDuo', jsonStr );
};

Storage.prototype.obtenerDatosFormDuo = function(){
    let json = localStorage.getItem( 'formularioDuo' );
    if( json ){
        json = JSON.parse( json );
    }
    return json;
};

Storage.prototype.guardarNumeroCartas = function(numeroCartas){
    localStorage.setItem('numeroCartas', numeroCartas);
};

Storage.prototype.obtenerNumeroCartas = function(){
    let nStr = localStorage.getItem('numeroCartas');
    if( nStr ){
        return Number.parseInt( nStr );
    }
    return null;
};