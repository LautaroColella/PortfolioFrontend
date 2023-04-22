import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'
import { LoginService } from '../rest/login.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [CookieService]
})

export class LoginComponent {

	constructor(private loginService: LoginService, private cookieService: CookieService, private router: Router) {}

	error_message: string | undefined = undefined;

	Login(email: string, password: string): void {
		let error: string | undefined = undefined;

		if(!email || !password){
			error = 'Invalid username or password';
		}
		// https://stackoverflow.com/a/46181/18895342
		else if(!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
			error = 'Invalid username';
		}

		this.error_message = error;

		if(!error){
			this.error_message = undefined;
			this.loginService.login(email, password)
			.subscribe((response: any): void => {
				this.cookieService.set('JWT', response.body, 1);
				this.router.navigate(['admin']);
			});
		}
	}
}
