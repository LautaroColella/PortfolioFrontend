import { TestBed } from '@angular/core/testing';
import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import {
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { UserService } from '@@shared/services/user.service';
import { TableUserRes } from '@@shared/interfaces/tableUserRes.interface';

describe('UserService', () => {
	let service: UserService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [UserService]
		});

		service = TestBed.inject(UserService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	describe('getUsers()', () => {
		it('should send a GET request and return the users', () => {
			const token: string = 'Bearer random generated jwt',
			responseUsers = [
				{
					id: 1,
					name: 'Valid data',
					email: 'Valid data',
					password: 'Valid data'
				},
				{
					id: 2,
					name: 'Valid data',
					email: 'Valid data',
					password: 'Valid data'
				}
			];

			service.getUsers(token).subscribe((response: HttpResponse<TableUserRes[]>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(Array.isArray(response.body))
					.withContext('Expect the response body to be an array')
					.toBe(true);
				expect(response.body)
					.withContext('Expect the response objects to match the interface')
					.toContain(
						jasmine.objectContaining({
							id: jasmine.any(Number),
							name: jasmine.any(String),
							email: jasmine.any(String),
							password: jasmine.any(String)
						})
					);
			});

			const req = httpTestingController.expectOne(service.uri);
			expect(req.request.method)
				.withContext('Expect the request method to be GET')
				.toBe('GET');

			req.flush(responseUsers);
		});
	});


	describe('getUser()', () => {
		it('should send a GET request to specific user and return it', () => {
			const token: string = 'Bearer random generated jwt',
			id: number = 1,
			responseUser = {
				id: 1,
				name: 'Valid data',
				email: 'Valid data',
				password: 'Valid data'
			};

			service.getUser(
				token,
				id
			).subscribe((response: HttpResponse<TableUserRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(typeof response.body)
					.withContext('Expect the response body to be an object')
					.toBe('object');
				expect(response.body)
					.withContext('Expect the response object to match the interface')
					.toEqual(responseUser);
			});

			const req = httpTestingController.expectOne(`${service.uri}/${id}`);
			expect(req.request.method)
				.withContext('Expect the request method to be GET')
				.toBe('GET');

			req.flush(responseUser);
		});
	});


	describe('createUser()', () => {
		it('should send a POST request and return the created user', () => {
			const token: string = 'Bearer random generated jwt',
			user = {
				id: 1,
				name: 'Random data',
				email: 'Random data',
				password: 'Random data'
			};

			service.createUser(
				token,
				user.name,
				user.email,
				user.password
			).subscribe((response: HttpResponse<TableUserRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the user')
					.toEqual(user);
			});

			const req = httpTestingController.expectOne(`${service.uri}/add`);
			expect(req.request.method)
				.withContext('Expect the request method to be POST')
				.toBe('POST');
			expect(req.request.body)
				.withContext('Expect the request body to be the item')
				.toEqual({
					name: user.name,
					email: user.email,
					password: user.password
				});

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

			req.flush(user);
		});
	});


	describe('updateUser()', () => {
		it('should send a PUT request and return the new item', () => {
			const token: string = 'Bearer random generated jwt',
			user = {
				id: 1,
				name: 'Random data',
				email: 'Random data',
				password: 'Random data'
			};

			service.updateUser(
				token,
				user.id,
				user.name,
				user.email,
				user.password
			).subscribe((response: HttpResponse<TableUserRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the user')
					.toEqual(user);
			});

			const req = httpTestingController.expectOne(`${service.uri}/update`);
			expect(req.request.method)
				.withContext('Expect the request method to be PUT')
				.toBe('PUT');
			expect(req.request.body)
				.withContext('Expect the request body to be the user')
				.toEqual(user);

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

			req.flush(user);
		});
	});


	describe('deleteUser()', () => {
		it('should send a DELETE request', () => {
			const token: string = 'Bearer random generated jwt',
			id: number = 1;

			service.deleteUser(
				token,
				id
			).subscribe((response: HttpResponse<{ }>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
			});

			const req = httpTestingController.expectOne(`${service.uri}/delete/${id}`);
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

			req.flush({});
		});
	});
});