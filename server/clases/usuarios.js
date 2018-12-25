class Usuarios{
  constructor(){
    this.personas = [];
  }

  agregarPersona(id,nombre,sala){
    let persona = {id,nombre, sala};
    this.personas.push(persona);
  }

  getPersona(id){
    let persona = this.personas.filter(persona => persona.id === id)[0]; //al dejarlo así se retorna lo primero
    return persona;
  }

  getPersonas(){
    return this.personas;
  }

  getPersonasPorSala(sala){
    let personasSala = this.personas.filter(persona => persona.sala === sala );
    return personasSala;
  }

  borrarPersona(id){
    let personaBorrada = this.getPersona(id);
    this.personas = this.personas.filter(persona => persona.id !== id); //se reemplaza arreglo actual
    return personaBorrada;
  }

}

module.exports = {
  Usuarios
}