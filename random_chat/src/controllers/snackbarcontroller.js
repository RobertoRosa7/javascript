export default class Snackbar {

    constructor(config){

        this.notification = config.notification;
        this.status = config.status;
        this.icon = config.icon;
        this.snackbar = config.snackbar;
        this.text = config.text;
    }
      
    callNotification(type, text, iconHtml){
        let color = '#00FF00';
        this.snackbar.show();
        this.icon.innerHTML = iconHtml;
        this.text.innerHTML = text;

        if(type == 'online') this.icon.css({color: color});

        this.notification.removeClass('online', 'offline');
        this.notification.className = type;

        setTimeout(() => {this.snackbar.hide();}, 3000);
    }
}