export class Item{
    private _name: string;
    private _functionality: string;

    constructor(name: string, functionality: string){
        this._name = name;
        this._functionality = functionality;
    }

    get name(): string{
        return this._name;
    }

    get functionality(): string{
        return this._functionality;
    }
}