import { TestBed } from '@angular/core/testing';
import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import {
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { LoginService } from '@@shared/services/login.service';

describe('LoginService', () => {
	let service: LoginService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [LoginService]
		});

		service = TestBed.inject(LoginService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});


	describe('login()', () => {
		it('should send a POST request with parameters and return the JWT', () => {
			const email: 	string = 'test@example.com',
			password: 		string = 'password',
			token:			string = 'Bearer random generated jwt';

			service.login(email, password).subscribe((response: HttpResponse<string>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(typeof response.body)
					.withContext('Expect the response body to be a string')
					.toBe('string');
				expect(response.body)
					.withContext('Expect the response body to start with "Bearer "')
					.toMatch(/^Bearer /);
				expect(response.body)
					.withContext('Expect the response body to equal the JWT')
					.toEqual(token);
			});

			const req = httpTestingController.expectOne(`${service.uri}/login`);
			expect(req.request.method)
				.withContext('Expect the request method to be POST')
				.toBe('POST');
			expect(req.request.body)
				.withContext('Expect the request body to match the login credentials')
				.toEqual({ email: email, password: password });

			req.flush(token);
		});
	});


	describe('checkToken()', () => {
		it('should send an auth DELETE request', () => {
			const token: string = 'Bearer random json web token';

			service.checkToken(token).subscribe((response: HttpResponse<{}>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
			});

			const req = httpTestingController.expectOne(`${service.uri}/about_item/check_token`);
			expect(req.request.method)
				.withContext('Expect the request method to be DELETE')
				.toBe('DELETE');
			
			const hasAuthHeader: boolean = req.request.headers.has('Authorization');
			expect(hasAuthHeader)
				.withContext('Expect the request headers to have Authorization')
				.toBe(true);

			if(hasAuthHeader){
				expect(req.request.headers.get('Authorization'))
					.withContext('Expect the request Authorization header to start with "Bearer "')
					.toMatch(/^Bearer /);
				expect(req.request.headers.get('Authorization'))
					.withContext('Expect the request Authorization header to match the token')
					.toEqual(token);
			}

			req.flush({ });
		});
	});
});