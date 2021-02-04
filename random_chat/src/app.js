import ButtonRandom from "../src/components/random-button/button-random-search.component";
import Root from "./index";
import Sidebar from "./components/sidebar/sidebar-component";
import ListContacts from "./components/list-contacts/list-contacts-component";
import Chat from "./components/chat/chat-component";
import Snackbar from "./components/snackbar/snackbar-component";
import LoadingPage from "./components/loading-page/loading-page-component";

export const ReaderDom = {
  appendComponent: function (component) {
    return new DOMParser()
      .parseFromString(component, "text/html")
      .querySelector("body").firstChild;
  },
};

window.customElements.define("app-root", Root);
window.customElements.define("app-loading-page", LoadingPage);
window.customElements.define("app-sidebar", Sidebar);
window.customElements.define("app-chat", Chat);
window.customElements.define("app-list-contacts", ListContacts);
window.customElements.define("app-button-random", ButtonRandom);
window.customElements.define("app-snackbar", Snackbar);
