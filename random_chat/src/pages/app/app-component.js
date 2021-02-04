import Format from "../../utils/format";
import User from "../../services/user";

import ProtoService from "../../services/prototype-serivce";
import RoutesService from "../../services/routes-service";
import Database from "../../services/websql-service";

export default class AppPage {
  constructor() {
    new ProtoService();
    this.db = new Database();
    this.router = new RoutesService();
    this.el = {};
    document
      .querySelectorAll("[id]")
      .forEach(
        (element) => (this.el[Format.formatToCamelCase(element.id)] = element)
      );
    this.fetchUser();
  }

  async fetchUser() {
    const { email } = JSON.parse(localStorage.getItem("isLogged"));
    const db = await this.db.createIndexdb("users");
    const data = await this.db.databaseIsReady(db);
    const user = await this.db.getData(data, "users", email);

    this.user = new User(email);
    this.user.name = user.name;
    this.user.email = user.email;
    this.user.photo = user.photo;

    await this.user.save();

    try {
      this.user.on("contactschange", (docs) => {
        const contacts = [];
        docs.forEach((doc) => {
          contacts.push(doc.data());
        });
        document
          .querySelector("app-list-contacts")
          .dispatchEvent(
            new CustomEvent("contactIsLoaded", { detail: contacts })
          );
      });

      await this.user.getContacts();
    } catch (e) {
      console.error(e);
    }

    document.querySelector("title").innerHTML = this.user.name
      ? this.user.name
      : this.user.email + " Random chat";
    this.el.app.dispatchEvent(new Event("isAuth"));

    this.notification(
      `Bem vindo(a) ${this.user.name ? this.user.name : this.user.email}`
    );
  }

  // closeBtnDialog(){
  //     this.el['dialogClose'].on('click', e => {
  //         this.el['dialog'].css({transform:'scale(0)'});
  //         setTimeout(() => {
  //             this.el['dialog'].hide();
  //         },300);
  //     });
  //     window.onclick = e => {
  //         if(e.target == this.el['dialog']){
  //             this.el['dialog'].css({transform:'scale(0)'});
  //             setTimeout(() => {
  //                 this.el['dialog'].hide();
  //             },300);
  //         }
  //     }
  // }
  // searchContact(){
  //     this.el['inputSearchContact'].on('keyup',async e => {
  //         try{
  //             await this.user.getContacts(e.target.value);
  //         }catch(e){
  //             console.error(e)
  //         }
  //     });
  // }
  notification(text) {
    document
      .querySelector("app-snackbar")
      .dispatchEvent(new CustomEvent("show", { detail: text }));
  }
}
