import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AlertService {

	currentAlert: boolean = false;

	constructor() { }

	myAlert(message: string, type: string): void {
		const alertPlaceholder: HTMLElement | null = document.getElementById('liveAlertPlaceholder');
		if (!this.currentAlert) {
			this.currentAlert = true;
			const wrapper: HTMLElement = document.createElement('div');
			wrapper.innerHTML = [
				`<div class="alert alert-${type}" role="alert">`,
				`   <div style="text-align: center;">${message}</div>`,
				'</div>'
				].join('');
			if (alertPlaceholder !== null) {
				alertPlaceholder.append(wrapper);
				setTimeout(() => {
					alertPlaceholder.innerHTML = '';
					this.currentAlert = false;
				}, 5000);
			}
		}
	}
}