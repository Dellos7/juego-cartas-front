var Controlador = function( vista, juegoCartasSocket, storage ){
    this.vista = vista;
    this.juegoCartasSocket = juegoCartasSocket;
    this.storage = storage;
    this.mapaCartas = [];
    this.cartasClicadas = [];
    this.cartasAcertadas = [];
    this.cartasAcertadasJugador = [];
    this.cartasAcertadasRival = [];
    this.turno = true;
    this.tipoJuego = null;
    this.idPartida = null;
    this.nombreRival = '';
};

Controlador.prototype.constructor = Controlador;

Controlador.prototype.iniciarJuego = function(tipoJuego){
    this.tipoJuego = tipoJuego;
    this.vista.mostrarOcultarZonaTablero();
    if( tipoJuego === TipoJuego.SOLO ){
        this.vista.ocultarElementosPantallaPrincipal();
        this.vista.toggleOcultarAciertosRival();
        this.construirTableroSolo(NUMERO_CARTAS, NUMERO_FOTOS);
    } else if( tipoJuego === TipoJuego.DUO ){
        this.vista.ocultarElementosPantallaPrincipal();
        let res = this.vista.obtenerIdPartidaJugadorYTipo();
        let { idPartida, nombreJugador, tipoUnion } = res;
        this.storage.guardarDatosFormDuo( nombreJugador, idPartida, tipoUnion );
        this.idPartida = idPartida;
        if( tipoUnion === TipoUnion.CREAR ){
            this.juegoCartasSocket.crearPartida( idPartida, nombreJugador );
        } else{
            this.juegoCartasSocket.unirseAPartida( idPartida, nombreJugador );
        }
    }
    return false;
};

Controlador.prototype.reiniciarJuego = function(){
    this.mapaCartas = [];
    this.cartasClicadas = [];
    this.cartasAcertadas = [];
    this.cartasAcertadasJugador = [];
    this.cartasAcertadasRival = [];
    this.turno = true;
    this.juegoCartasSocket = juegoCartasSocket;
    this.tipoJuego = null;
    this.idPartida = null;
    this.nombreRival = '';
};

Controlador.prototype.volverApantallaInicial = function(){
    /*this.vista.mostrarPantallaInicial();
    this.reiniciarJuego();*/
    window.location.href = '/';
    return false;
};

Controlador.prototype.volverAJugar = function(){
    //todo
};

Controlador.prototype.rotarCarta = function(idCarta, esJugador){
    // Si estamos jugando en duo, avisamos al otro jugador que hemos girado
    if( esJugador && this.tipoJuego == TipoJuego.DUO ){
        this.juegoCartasSocket.girarCarta( idCarta, this.idPartida );
    }
    let rotada = this.vista.rotarCarta(idCarta);
    if( !rotada ){
        this.cartasClicadas.push(idCarta);
        if( this.cartasClicadas.length >= 2 ){ // Ya se ha hecho click en 2 cartas
            if( this.tipoJuego === TipoJuego.DUO ){
                // Solo podemos clicar si es nuestro turno
                this.turno = !esJugador;
                this.vista.toggleHabilitarClick( this.turno );
            }
            if( this.comprobarAcierto() ){
                this.acierto( idCarta, esJugador );
            }
            // No ha acertado
            else{
                this.fallo();
            }
            // Cuando hemos hecho click en 2, deshabilitamos todas las cartas para que no se
            // puedan clicar
            this.vista.habilitarClickCartasToggle( false );
            if( this.tipoJuego == TipoJuego.DUO ){
                this.mostrarMensajeTurnoGanadorOPerdedor();
            } else{
                this.mostrarFinJuego();
            }
        }
    }
};

Controlador.prototype.acierto = function( idCarta, esJugador ){
    if( this.cartasAcertadas.indexOf( this.mapaCartas[this.cartasClicadas[0]] ) < 0 ){
        this.cartasAcertadas.push( this.mapaCartas[this.cartasClicadas[0]] );
    }
    if( esJugador ){
        this.anyadirCartaAcertadaJugador( idCarta );
    } else{
        this.anyadirCartaAcertadaRival( idCarta );
    }
    // Si acertamos, al cabo de 2 segundos...
    setTimeout( () => {
        // Habilitamos todas las cartas
        this.vista.habilitarClickCartasToggle( true );
        // Deshabilitamos la que hemos acertado
        this.vista.habilitarClickCartaToggleId( this.cartasClicadas[0], false );
        this.vista.habilitarClickCartaToggleId( this.cartasClicadas[1], false );
        this.cartasClicadas.splice(0, this.cartasClicadas.length);
    }, TIMEOUT_ACIERTO_FALLO );
};

Controlador.prototype.fallo = function( esJugador ){
    // Al hacer click en 2 cartas y perder, al cabo de 2s...
    setTimeout( () => {
        // Habilitarlas de nuevo
        this.vista.habilitarClickCartasToggle( true );
        // Rotar las que hemos clicado
        this.rotarCarta( this.cartasClicadas[0], esJugador );
        this.rotarCarta( this.cartasClicadas[1], esJugador );
        // Eliminarlas del array de clicadas
        this.cartasClicadas.splice(0, this.cartasClicadas.length);
    }, TIMEOUT_ACIERTO_FALLO );
};

Controlador.prototype.anyadirCartaAcertadaJugador = function( idCarta ) {
    let numeroCarta = this.mapaCartas[idCarta];
    let idxAciertos = this.cartasAcertadasJugador.length;
    this.vista.anyadirCartaAcertadaJugador( idxAciertos, numeroCarta );
    this.cartasAcertadasJugador.push(this.mapaCartas[idCarta]);
};

Controlador.prototype.anyadirCartaAcertadaRival = function(idCarta){
    let numeroCarta = this.mapaCartas[idCarta];
    let idxAciertos = this.cartasAcertadasRival.length;
    this.vista.anyadirCartaAcertadaRival( idxAciertos, numeroCarta );
    this.cartasAcertadasRival.push(this.mapaCartas[idCarta]);
};

Controlador.prototype.construirTableroSolo = function(numeroCartas, numFotos){
    let cartasIds = [];
    let arrCartas = this.arrayCartasAleatorias(numeroCartas, numFotos);
    for( let numCarta of arrCartas ){
        let idCarta = this.generarIdCarta(cartasIds);
        cartasIds.push(idCarta);
        this.mapaCartas[idCarta] = numCarta;
    }
    this.vista.construirTablero( this.mapaCartas );
};

Controlador.prototype.construirTableroDuo = function(mapaCartas, turno){
    this.turno = turno == Turno.TURNO ? true : false;
    this.vista.mostrarMensaje( this.turno ? "Empiezas tú" : "NO empiezas tú", false );
    this.vista.toggleHabilitarClick( this.turno );
    this.mapaCartas = mapaCartas;
    this.vista.construirTablero( this.mapaCartas );
};

Controlador.prototype.arrayCartasAleatorias = function(numeroCartas, numeroFotos){
    let arr = [];
    let num = 0;
    while( num < numeroCartas*2 ){
        let rand = Math.floor( Math.random()*numeroFotos + 1 );
        if( this.numVecesElEnArr(arr, rand) < 2 ){
            arr.push(rand);
            num++;
        }
    }
    return arr;
};

Controlador.prototype.numVecesElEnArr = function(arr, el){
    let num = 0;
    for( let i = 0; i < arr.length; i++ ){
        if( arr[i] === el ){
            num++;
        }
    }
    return num;
};

Controlador.prototype.generarIdCarta = function(arrCartasIds){
    let rand = Math.floor( Math.random()*1000 ); // De 0 a 999
    while( arrCartasIds.indexOf(rand) >= 0 ){
        rand = Math.floor( Math.rand()*1000 );
    }
    return rand;
};

Controlador.prototype.comprobarAcierto = function(){
    if( this.cartasClicadas && this.cartasClicadas.length == 2 ){
        if( this.mapaCartas[this.cartasClicadas[0]] == this.mapaCartas[this.cartasClicadas[1]] ){
            return true;
        }
    }
    return false;
};

Controlador.prototype.mostrarMensajeTurnoGanadorOPerdedor = function(){
    if( this.cartasAcertadas.length === NUMERO_CARTAS ){
        if( this.cartasAcertadasJugador.length > this.cartasAcertadasRival.length ){
            this.vista.mostrarMensaje( "Fin de la partida. ¡Has ganado!", true );
        } else if( this.cartasAcertadasJugador.length == this.cartasAcertadasRival.length ){
            this.vista.mostrarMensaje( "Fin de la partida. Empate ;)", true );
        } else{
            this.vista.mostrarMensajeError( "Fin de la partida. Has perdido :(", true );
        }
        this.vista.toggleHabilitarClick( false );
    } else{
        if( this.turno ){
            this.vista.mostrarMensaje( "Es tu turno", false );
        }
    }
};

Controlador.prototype.mostrarFinJuego = function(){
    if( this.cartasAcertadas.length === NUMERO_CARTAS ){
        this.vista.mostrarMensaje( "Fin de la partida", true );
    }
};