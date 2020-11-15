export class Base64 {
    /**
     * method util to convert url in base64
     * @param {*} urlBase64 
     */
    static getMimeType(urlBase64){
        // expression regular - find mimetype
        let regex = /^data:(.+);base64,(.*)$/;
        let result = urlBase64.match(regex);
        return result[1];
    }

    //method to convert from base64 to file
    static toFile(urlBase64){
        let mimeType = Base64.getMimeType(urlBase64);
        let ext = mimeType.split('/')[1];
        // rename file with date and ext
        let filename = `file${Date.now()}.${ext}`;
        return fetch(urlBase64).then(res =>{
            return res.arrayBuffer();
        }).then(buffer =>{
            return new File([buffer], filename,{type:mimeType});
        });
    }
}