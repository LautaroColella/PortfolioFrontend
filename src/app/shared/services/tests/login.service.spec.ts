import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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

	it('should send a POST request to the login endpoint', () => {
		const email = 'test@example.com';
		const password = 'password';

		service.login(email, password).subscribe(response => {
			expect(response.status)
				.withContext('Expect the response status to be 200')
				.toBe(200);
			expect(typeof response.body)
				.withContext('Expect the response body to be a string')
				.toBe('string');
		});

		const req = httpTestingController.expectOne(`${service.uri}/login`);
		expect(req.request.method)
			.withContext('Expect the request method to be POST')
			.toBe('POST');
		expect(req.request.body)
			.withContext('Expect the request body to match the login credentials')
			.toEqual({ email: email, password: password });

		req.flush('Generated random JWT');
	});
});