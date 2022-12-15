
const doesDataMatchStructure = (data: any, structure: any) =>{
  let dataKeys =  Object.keys(data);
  let structureKeys = Object.keys(structure);

  if(dataKeys.length !== structureKeys.length){
    return false;
  }
  for (let i = 0; i < structureKeys.length; i++) {
    if(!dataKeys.includes(structureKeys[i])){
      return false
    }else if(typeof(data[structureKeys[i]]) !== structure[structureKeys[i]]){
      return false
    }
  }

  return true
}