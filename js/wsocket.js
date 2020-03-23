var JuegoCartasSocket = function( address, port ){
    this.address = address;
    this.port = port;
    this.socket = new WebSocket(`ws://${this.address}:${this.port}`);
    this.controlador = null;
    this.vista = null;
};

JuegoCartasSocket.prototype.conectarse = function(cb){
    this.socket.onopen = (e)=> {
        console.log('Se ha establecido conexión con el socket.');
        if( cb ){
            cb(e);
        }
        this.enviarNumeroCartasYFotos( NUMERO_CARTAS, NUMERO_FOTOS );
    };
    this.socket.onmessage = (e) =>{
        this.tratarMensajeRecibido(e.data);
    };
    this.socket.onerror = (e) => {
        if( e && e.data ){
            this.vista.mostrarMensajeError( e.data, true );
        } else if( e.type === "error" ){
            this.vista.mostrarMensajeError( "Error de conexión con el servidor", false );
        }
    };
    this.socket.onclose = (e) => {
        console.log('onclose');
        this.vista.ocultarBotonComenzarDuo();
    };
};

JuegoCartasSocket.prototype.crearPartida = function( idPartida, nombreJugador ){
    this.socket.send( `${DatosMensaje.TIPO_MENSAJE}=${TipoMensajeCliente.CREAR_PARTIDA};${DatosMensaje.ID_PARTIDA}=${idPartida};${DatosMensaje.NOMBRE_JUGADOR}=${nombreJugador}` );
};

JuegoCartasSocket.prototype.unirseAPartida = function( idPartida, nombreJugador ){
    this.socket.send( `${DatosMensaje.TIPO_MENSAJE}=${TipoMensajeCliente.UNIRSE_A_PARTIDA};${DatosMensaje.ID_PARTIDA}=${idPartida};${DatosMensaje.NOMBRE_JUGADOR}=${nombreJugador}` );
};

JuegoCartasSocket.prototype.girarCarta = function( idCarta, idPartida ){
    this.socket.send( `${DatosMensaje.TIPO_MENSAJE}=${TipoMensajeCliente.GIRAR_CARTA};${DatosMensaje.ID_PARTIDA}=${idPartida};${DatosMensaje.ID_CARTA}=${idCarta}` );
};

JuegoCartasSocket.prototype.tratarMensajeRecibido = function( mensaje ){
    if( mensaje ){
        let datosMensaje = obtenerArrayDatosMensaje(mensaje);
        const tipoMensaje = datosMensaje[DatosMensaje.TIPO_MENSAJE];
        const idPartida = datosMensaje[DatosMensaje.ID_PARTIDA];
        switch( tipoMensaje ){
            case TipoMensajeServidor.PARTIDA_CREADA:
                this.vista.mostrarMensajeEsperandoOtroJugador( idPartida );
                break;
            case TipoMensajeServidor.JUGADOR_UNIDO:
                this.vista.mostrarMensaje( datosMensaje[DatosMensaje.MENSAJE] );
                this.vista.mostrarMensajeEsperandoOtroJugador( idPartida );
                break;
            case TipoMensajeServidor.ERROR:
                this.vista.mostrarMensajeError( datosMensaje[DatosMensaje.MENSAJE], true );
                break;
            case TipoMensajeServidor.COMIENZA_JUEGO:
                this.vista.setNombreRival( datosMensaje[DatosMensaje.NOMBRE_RIVAL] );
                // Comenzamos el juego a los 2s
                setTimeout( () => {
                    const cartas = datosMensaje[DatosMensaje.CARTAS];
                    const turno = datosMensaje[DatosMensaje.TURNO];
                    const mapaCartas = montarMapaCartas( cartas );
                    console.log('MAPA CARTAS', mapaCartas);
                    this.controlador.construirTableroDuo( mapaCartas, turno );
                }, 2000 );
                break;
            case TipoMensajeServidor.GIRA_CARTA:
                const idCarta = datosMensaje[DatosMensaje.ID_CARTA];
                this.controlador.rotarCarta(idCarta, false);
                break;
        }
    }
};

JuegoCartasSocket.prototype.enviarNumeroCartasYFotos = function( numCartas, numFotos ){
    this.socket.send(
        `${DatosMensaje.TIPO_MENSAJE}=${TipoMensajeCliente.NUM_CARTAS_Y_FOTOS};${DatosMensaje.NUMERO_CARTAS}=${numCartas};${DatosMensaje.NUMERO_FOTOS}=${numFotos}`
        );
};

let obtenerArrayDatosMensaje = (mensaje) => {
    let datosMensaje = [];
    let res = mensaje.split(";");
    for( let elem of res ){
        const elemArr = elem.split("=");
        datosMensaje[elemArr[0]] = elemArr[1];
    }
    return datosMensaje;
};

let montarMapaCartas = (strMapaCartas) => {
    let mapa = [];
    if( strMapaCartas ){
        const arrMapa = strMapaCartas.split("_");
        for( const elem of arrMapa ){
            const elemArr = elem.split("-");
            if( elemArr && elemArr.length > 1 ){
                mapa[elemArr[0]] = elemArr[1];
            }
        }
    }
    return mapa;
};