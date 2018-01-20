export class Player {
  id: number;
  team: string;

  constructor(values: Object = {}){
    Object.assign(this, values);
  }
}
