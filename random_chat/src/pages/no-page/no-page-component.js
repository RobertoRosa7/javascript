import { ReaderDom } from '../../app';
import NoPageComponent from './no-page-component.html';

export default class NoPage extends HTMLElement{
	constructor(){
		super();
		// this.appendChild(ReaderDom.appendComponent(NoPageComponent));
		// this.router = new RoutesService();

		// this.querySelector('#no-page-back-button')
		//     .on('click', e => {
		//         console.log(e);
		// });
	}
}