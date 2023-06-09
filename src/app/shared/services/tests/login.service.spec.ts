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

	it('should send one POST request to the login endpoint - Success', () => {
		const email: 	string = 'test@example.com',
		password: 		string = 'password',
		token:			string = 'Bearer random generated jwt';

		service.login(email, password).subscribe(
			(response: HttpResponse<string>) => {
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
			},
			(error: HttpResponse<HttpErrorResponse>) => {
				fail('Expected success response, but received error response');
			}
		);

		const req = httpTestingController.expectOne(`${service.uri}/login`);
		expect(req.request.method)
			.withContext('Expect the request method to be POST')
			.toBe('POST');
		expect(req.request.body)
			.withContext('Expect the request body to match the login credentials')
			.toEqual({ email: email, password: password });

		req.flush(token);
	});

	it('should send one POST request to the login endpoint - Error', () => {
		const email: 	string = 'Invalid email',
		password: 		string = 'Invalid password';

		service.login(email, password).subscribe(
			(response: HttpResponse<string>) => {
				fail('Expected error response, but received success response');
			},
			(error: HttpErrorResponse) => {
				expect(error.status)
					.withContext('Expect the error status to be 401')
					.toBe(401);
				expect(JSON.parse(error.error))
					.withContext('Expect the error body to be an object with a specific error message')
					.toEqual({ message: 'Invalid username or password' });
			}
		);

		const req = httpTestingController.expectOne(`${service.uri}/login`);
		expect(req.request.method)
			.withContext('Expect the request method to be POST')
			.toBe('POST');
		expect(req.request.body)
			.withContext('Expect the request body to match the login credentials')
			.toEqual({ email: email, password: password });

		req.flush(
			{
				message: 'Invalid username or password'
			},
			{
				status: 401,
				statusText: 'Unauthorized'
			}
		);
	});


	it('should send one DELETE request to the checkToken endpoint - Success', () => {
		const token: string = 'Bearer random json web token';

		service.checkToken(token).subscribe(
			(response: HttpResponse<{}>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
			},
			(error: HttpResponse<HttpErrorResponse>) => {
				fail('Expected success response, but received error response');
			}
		);

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

	it('should send one DELETE request to the checkToken endpoint - Error', () => {
		const token: string = 'Random json web token';

		service.checkToken(token).subscribe(
			(response: HttpResponse<{}>) => {
				fail('Expected error response, but received success response');
			},
			(error: HttpResponse<HttpErrorResponse>) => {
				expect(error.status)
					.withContext('Expect the response status to be 401')
					.toBe(401);
			}
		);

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
				.withContext('Expect the request Authorization header to match the token')
				.toEqual(token);
		}

		req.flush('', {
			status: 401,
			statusText: 'Unauthorized'
		});
	});
	
});