import { ClassEvent } from "../utils/ClassEvent";

export class Model extends ClassEvent{
    constructor(){
        super();
        this._data = {}
    }
    // receive data in JSON
    fromJSON(json){
        // Object.assign to mescle JSON, update
        this._data = Object.assign(this._data, json);
        // warning all who is listening
        this.trigger('dataChange', this.toJSON());
    }
    // convert to JSON
    toJSON(){
        return this._data;
    }
}