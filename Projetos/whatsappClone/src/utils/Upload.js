import { Firebase } from "./Firebase";

export class Upload{
 
    static send(file, from){
        return new Promise((success, fail) =>{
            let uploadTask = Firebase.hd().ref(from).child(`${Date.now()}_${file.name}`).put(file);
            uploadTask.on('state_changed', e =>{
            // fazer image load aqui
            }, err =>{
                console.error(err);
            }, () =>{
                success(uploadTask.snapshot);
            });
        });
    }
}