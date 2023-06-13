import { TestBed } from '@angular/core/testing';
import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import {
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { ContactService } from '@@shared/services/contact.service';
import {
	TableContactItemRes,
	TableContactMessageRes
} from '@@shared/interfaces/tableContactRes.interface';

describe('ContactService', () => {
	let service: ContactService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [ContactService]
		});

		service = TestBed.inject(ContactService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});


	describe('getItems()', () => {
		it('should send a GET request, return the items and update the cached items', () => {
			const responseItems = [
				{
					id: 1,
					name: 'Valid data',
					account: 'Valid data',
					link: 'Valid data',
					image_uri: 'Valid data',
					image_alt: 'Valid data'
				},
				{
					id: 2,
					name: 'Valid data',
					account: 'Valid data',
					link: 'Valid data',
					image_uri: 'Valid data',
					image_alt: 'Valid data'
				}
			];

			spyOn(service, 'getItems').and.callThrough();

			service.getItems().subscribe((response: HttpResponse<TableContactItemRes[]>) => {
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
							account: jasmine.any(String),
							link: jasmine.any(String),
							image_uri: jasmine.any(String),
							image_alt: jasmine.any(String)
						})
					);
			});

			expect(service.getItems)
				.withContext('Expect the service to be called')
				.toHaveBeenCalled();
			expect(service.getItems)
				.withContext('Expect the service to be called only once')
				.toHaveBeenCalledTimes(1);

			const req = httpTestingController.expectOne(service.uriCi);
			expect(req.request.method)
				.withContext('Expect the request method to be GET')
				.toBe('GET');

			req.flush(responseItems);

			expect(service['cachedItems'])
				.withContext('Expect the cached items to be the response items')
				.toEqual(responseItems);
		});
		it('should return the cached items if they are not null', () => {
			const cachedItems = [
				{
					id: 1,
					name: 'Valid data',
					account: 'Valid data',
					link: 'Valid data',
					image_uri: 'Valid data',
					image_alt: 'Valid data'
				},
				{
					id: 2,
					name: 'Valid data',
					account: 'Valid data',
					link: 'Valid data',
					image_uri: 'Valid data',
					image_alt: 'Valid data'
				}
			];
			service['cachedItems'] = cachedItems;

			spyOn(service, 'getItems').and.callThrough();

			service.getItems().subscribe((response: HttpResponse<TableContactItemRes[]>) => {
				expect(response.body)
					.withContext('Expect the response body to be the cached items')
					.toEqual(cachedItems);
			});

			expect(service.getItems)
				.withContext('Expect the service to be called')
				.toHaveBeenCalled();
			expect(service.getItems)
				.withContext('Expect the service to be called only once')
				.toHaveBeenCalledTimes(1);

			expect(service['cachedItems'])
				.withContext('Expect the cached items to not be modified')
				.toEqual(cachedItems);
		});
	});


	describe('getItem()', () => {
		it('should send a GET request to specific item and return it', () => {
			const id: number = 1;

			service.getItem(id).subscribe(
				(response: HttpResponse<TableContactItemRes>) => {
					expect(response.status)
						.withContext('Expect the response status to be 200')
						.toBe(200);
					expect(typeof response.body)
						.withContext('Expect the response body to be an object')
						.toBe('object');
					expect(response.body)
						.withContext('Expect the response object to match the interface')
						.toEqual(
							jasmine.objectContaining({
								id: jasmine.any(Number),
								name: jasmine.any(String),
								account: jasmine.any(String),
								link: jasmine.any(String),
								image_uri: jasmine.any(String),
								image_alt: jasmine.any(String)
							})
						);
				},
				(error: HttpResponse<HttpErrorResponse>) => {
					fail('Expected success response, but received error response');
				}
			);

			const req = httpTestingController.expectOne(`${service.uriCi}/${id}`);
			expect(req.request.method)
				.withContext('Expect the request method to be GET')
				.toBe('GET');

			req.flush(
				{
					id: 1,
					name: 'Valid data',
					account: 'Valid data',
					link: 'Valid data',
					image_uri: 'Valid data',
					image_alt: 'Valid data'
				}
			);
		});
	});


	describe('createItem()', () => {
		it('should send a POST request and return the created item', () => {
			const token: string = 'Bearer random generated jwt',
			contactItem = {
				id: 1,
				name: 'Valid data',
				account: 'Valid data',
				itemData: {
					link: 'Random data',
					image_uri: 'Random data',
					image_alt: 'Random data'
				}
			};

			service.createItem(
				token,
				contactItem.name,
				contactItem.account,
				contactItem.itemData
			).subscribe(
				(response: HttpResponse<TableContactItemRes>) => {
					expect(response.status)
						.withContext('Expect the response status to be 200')
						.toBe(200);
					expect(response.body)
						.withContext('Expect the response body to be the item with id')
						.toEqual(contactItem);
				},
				(error: HttpResponse<HttpErrorResponse>) => {
					fail('Expected success response, but received error response');
				}
			);

			const req = httpTestingController.expectOne(`${service.uriCi}/add`);
			expect(req.request.method)
				.withContext('Expect the request method to be POST')
				.toBe('POST');
			expect(req.request.body)
				.withContext('Expect the request body to be the item')
				.toEqual({
					name: contactItem.name,
					account: contactItem.account,
					link: contactItem.itemData.link,
					image_uri: contactItem.itemData.image_uri,
					image_alt: contactItem.itemData.image_alt
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

			req.flush(contactItem);
		});

		it('should send a POST request and return the created item with optional values as null', () => {
			const token: string = 'Bearer random generated jwt',
			contactItem = {
				id: 1,
				name: 'Valid data',
				account: 'Valid data',
				itemData: {
					link: undefined,
					image_uri: undefined,
					image_alt: undefined
				}
			};

			service.createItem(
				token,
				contactItem.name,
				contactItem.account,
				contactItem.itemData
			).subscribe(
				(response: HttpResponse<TableContactItemRes>) => {
					expect(response.status)
						.withContext('Expect the response status to be 200')
						.toBe(200);
					expect(response.body)
						.withContext('Expect the response body to be the item with id')
						.toEqual(contactItem);
				},
				(error: HttpResponse<HttpErrorResponse>) => {
					fail('Expected success response, but received error response');
				}
			);

			const req = httpTestingController.expectOne(`${service.uriCi}/add`);
			expect(req.request.method)
				.withContext('Expect the request method to be POST')
				.toBe('POST');
			expect(req.request.body)
				.withContext('Expect the request body to be the item with null values')
				.toEqual({
					name: contactItem.name,
					account: contactItem.account,
					link: null,
					image_uri: null,
					image_alt: null
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

			req.flush(contactItem);
		});
	});


	describe('updateItem()', () => {
		it('should send a PUT request and return the new item', () => {
			const token: string = 'Bearer random generated jwt',
			contactItem = {
				id: 1,
				name: 'Valid data',
				account: 'Valid data',
				itemData: {
					link: 'Random data',
					image_uri: 'Random data',
					image_alt: 'Random data'
				}
			};

			service.updateItem(
				token,
				contactItem.id,
				contactItem.name,
				contactItem.account,
				contactItem.itemData
			).subscribe(
				(response: HttpResponse<TableContactItemRes>) => {
					expect(response.status)
						.withContext('Expect the response status to be 200')
						.toBe(200);
					expect(response.body)
						.withContext('Expect the response body to be the item')
						.toEqual(contactItem);
				},
				(error: HttpResponse<HttpErrorResponse>) => {
					fail('Expected success response, but received error response');
				}
			);

			const req = httpTestingController.expectOne(`${service.uriCi}/update`);
			expect(req.request.method)
				.withContext('Expect the request method to be PUT')
				.toBe('PUT');
			expect(req.request.body)
				.withContext('Expect the request body to be the item')
				.toEqual({
					id: contactItem.id,
					name: contactItem.name,
					account: contactItem.account,
					link: contactItem.itemData.link,
					image_uri: contactItem.itemData.image_uri,
					image_alt: contactItem.itemData.image_alt
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

			req.flush(contactItem);
		});

		it('should send a PUT request and return the new item with optional values as null', () => {
			const token: string = 'Bearer random generated jwt',
			contactItem = {
				id: 1,
				name: 'Valid data',
				account: 'Valid data',
				itemData: {
					link: undefined,
					image_uri: undefined,
					image_alt: undefined
				}
			};

			service.updateItem(
				token,
				contactItem.id,
				contactItem.name,
				contactItem.account,
				contactItem.itemData
			).subscribe(
				(response: HttpResponse<TableContactItemRes>) => {
					expect(response.status)
						.withContext('Expect the response status to be 200')
						.toBe(200);
					expect(response.body)
						.withContext('Expect the response body to be the item with null values')
						.toEqual(contactItem);
				},
				(error: HttpResponse<HttpErrorResponse>) => {
					fail('Expected success response, but received error response');
				}
			);

			const req = httpTestingController.expectOne(`${service.uriCi}/update`);
			expect(req.request.method)
				.withContext('Expect the request method to be PUT')
				.toBe('PUT');
			expect(req.request.body)
				.withContext('Expect the request body to be the item')
				.toEqual({
					id: contactItem.id,
					name: contactItem.name,
					account: contactItem.account,
					link: null,
					image_uri: null,
					image_alt: null
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

			req.flush(contactItem);
		});
	});


	describe('deleteItem()', () => {
		it('should send a DELETE request', () => {
			const token: string = 'Bearer random generated jwt',
			id: number = 1;

			service.deleteItem(
				token,
				id
			).subscribe(
				(response: HttpResponse<{ }>) => {
					expect(response.status)
						.withContext('Expect the response status to be 200')
						.toBe(200);
				},
				(error: HttpResponse<HttpErrorResponse>) => {
					fail('Expected success response, but received error response');
				}
			);

			const req = httpTestingController.expectOne(`${service.uriCi}/delete/${id}`);
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
	

/*
	describe('getMessage()', () => {
		it('', () => {

		});
	});
*/
});