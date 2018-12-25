const { io } = require('../server');
const {Usuarios} = require ('../clases/usuarios');
const {crearMensaje} = require('../utils/utils');
const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat',(data,callback)=>{

        console.log(data);
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: "EL nombre/sala es necesario"
            });
        }

        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas',usuarios.getPersonasPorSala(data.sala)); //el nombre de la sala en ves del usuario

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje); //informacion desde el cliente
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);
    });

    client.on('disconnect',() => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Admin',`${personaBorrada.nombre} salió`));

        client.broadcast.to(personaBorrada.sala).emit('listaPersonas',usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    //mensajes privados

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});