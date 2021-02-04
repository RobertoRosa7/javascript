import Firebase from "./firebase";

export default class UploadFileService {

    static sendFile(from, file){
        return new Promise(async (resolve, reject) => {
            try{
                const fileData = await Firebase.storage().ref(from).child(`${Date.now()}_${file.name}`).put(file);
                resolve(await fileData.ref.getDownloadURL());
            }catch(e){
                console.error(e);
                reject(e);
            }
            // uploadTask.on('state_changed', progress, error, success);

            // async function progress(e){
            //     console.log('uploading...');
            // }
            
            // async function error(e){
            //     console.error(e)
            // }
            
            // async function success(){
            //     uploadTask.then(e => console.log(e.downloadURL));
            // }

            // uploadTask.on('state_changed', e => {
            //     console.log('uplading...');
            // }, err => {
            //     console.error(err);
            // }, () => {
            //     console.log(uploadTask.re);
            // });
        });
    }
}