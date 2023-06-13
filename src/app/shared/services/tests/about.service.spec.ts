import { TestBed } from '@angular/core/testing';
import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import {
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { AboutService } from '@@shared/services/about.service';
import { TableAboutItemRes } from '@@shared/interfaces/tableAboutItemRes.interface';

describe('AboutService', () => {
	let service: AboutService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [AboutService]
		});

		service = TestBed.inject(AboutService);
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
					item_type: 1,
					name: 'Valid data',
					date: 'Valid data',
					description: 'Valid data',
					link: 'Valid data',
					image_uri: 'Valid data',
					image_alt: 'Valid data'
				},
				{
					id: 2,
					item_type: 1,
					name: 'Valid data',
					date: 'Valid data',
					description: 'Valid data',
					link: 'Valid data',
					image_uri: 'Valid data',
					image_alt: 'Valid data'
				}
			];

			spyOn(service, 'getItems').and.callThrough();

			service.getItems().subscribe((response: HttpResponse<TableAboutItemRes[]>) => {
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
							item_type: jasmine.any(Number),
							name: jasmine.any(String),
							date: jasmine.any(String),
							description: jasmine.any(String)
						})
					);
			});

			expect(service.getItems)
				.withContext('Expect the service to be called')
				.toHaveBeenCalled();
			expect(service.getItems)
				.withContext('Expect the service to be called only once')
				.toHaveBeenCalledTimes(1);

			const req = httpTestingController.expectOne(service.uri);
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
					item_type: 1,
					name: 'Valid data',
					date: 'Valid data',
					description: 'Valid data',
					link: 'Valid data',
					image_uri: 'Valid data',
					image_alt: 'Valid data'
				},
				{
					id: 2,
					item_type: 1,
					name: 'Valid data',
					date: 'Valid data',
					description: 'Valid data',
					link: 'Valid data',
					image_uri: 'Valid data',
					image_alt: 'Valid data'
				}
			];
			service['cachedItems'] = cachedItems;

			spyOn(service, 'getItems').and.callThrough();

			service.getItems().subscribe((response: HttpResponse<TableAboutItemRes[]>) => {
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

			service.getItem(id).subscribe((response: HttpResponse<TableAboutItemRes>) => {
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
							item_type: jasmine.any(Number),
							name: jasmine.any(String),
							date: jasmine.any(String),
							description: jasmine.any(String)
						})
					);
			});

			const req = httpTestingController.expectOne(`${service.uri}/${id}`);
			expect(req.request.method)
				.withContext('Expect the request method to be GET')
				.toBe('GET');

			req.flush(
				{
					id: 1,
					item_type: 1,
					name: 'Valid data',
					date: 'Valid data',
					description: 'Valid data',
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
			aboutItem = {
				id: 1,
				item_type: 1,
				name: 'Random data',
				date: 'Random data',
				description: 'Random data',
				itemData: {
					link: 'Random data',
					image_uri: 'Random data',
					image_alt: 'Random data'
				}
			};

			service.createItem(
				token,
				aboutItem.item_type,
				aboutItem.name,
				aboutItem.date,
				aboutItem.description,
				aboutItem.itemData
			).subscribe((response: HttpResponse<TableAboutItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item with id')
					.toEqual(aboutItem);
			});

			const req = httpTestingController.expectOne(`${service.uri}/add`);
			expect(req.request.method)
				.withContext('Expect the request method to be POST')
				.toBe('POST');
			expect(req.request.body)
				.withContext('Expect the request body to be the item')
				.toEqual({
					item_type: aboutItem.item_type,
					name: aboutItem.name,
					date: aboutItem.date,
					description: aboutItem.description,
					link: aboutItem.itemData.link,
					image_uri: aboutItem.itemData.image_uri,
					image_alt: aboutItem.itemData.image_alt
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

			req.flush(aboutItem);
		});

		it('should send a POST request and return the created item with optional values as null', () => {
			const token: string = 'Bearer random generated jwt',
			aboutItem = {
				id: 1,
				item_type: 1,
				name: 'Random data',
				date: 'Random data',
				description: 'Random data',
				itemData: {
					link: undefined,
					image_uri: undefined,
					image_alt: undefined
				}
			};

			service.createItem(
				token,
				aboutItem.item_type,
				aboutItem.name,
				aboutItem.date,
				aboutItem.description,
				aboutItem.itemData
			).subscribe((response: HttpResponse<TableAboutItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item with id')
					.toEqual(aboutItem);
			});

			const req = httpTestingController.expectOne(`${service.uri}/add`);
			expect(req.request.method)
				.withContext('Expect the request method to be POST')
				.toBe('POST');
			expect(req.request.body)
				.withContext('Expect the request body to be the item with null values')
				.toEqual({
					item_type: aboutItem.item_type,
					name: aboutItem.name,
					date: aboutItem.date,
					description: aboutItem.description,
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

			req.flush(aboutItem);
		});
	});

	describe('updateItem()', () => {
		it('should send a PUT request and return the new item', () => {
			const token: string = 'Bearer random generated jwt',
			aboutItem = {
				id: 1,
				item_type: 1,
				name: 'Random data',
				date: 'Random data',
				description: 'Random data',
				itemData: {
					link: 'Random data',
					image_uri: 'Random data',
					image_alt: 'Random data'
				}
			};

			service.updateItem(
				token,
				aboutItem.id,
				aboutItem.item_type,
				aboutItem.name,
				aboutItem.date,
				aboutItem.description,
				aboutItem.itemData
			).subscribe((response: HttpResponse<TableAboutItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item')
					.toEqual(aboutItem);
			});

			const req = httpTestingController.expectOne(`${service.uri}/update`);
			expect(req.request.method)
				.withContext('Expect the request method to be PUT')
				.toBe('PUT');
			expect(req.request.body)
				.withContext('Expect the request body to be the item')
				.toEqual({
					id: aboutItem.id,
					item_type: aboutItem.item_type,
					name: aboutItem.name,
					date: aboutItem.date,
					description: aboutItem.description,
					link: aboutItem.itemData.link,
					image_uri: aboutItem.itemData.image_uri,
					image_alt: aboutItem.itemData.image_alt
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

			req.flush(aboutItem);
		});

		it('should send a PUT request and return the new item with optional values as null', () => {
			const token: string = 'Bearer random generated jwt',
			aboutItem = {
				id: 1,
				item_type: 1,
				name: 'Random data',
				date: 'Random data',
				description: 'Random data',
				itemData: {
					link: undefined,
					image_uri: undefined,
					image_alt: undefined
				}
			};

			service.updateItem(
				token,
				aboutItem.id,
				aboutItem.item_type,
				aboutItem.name,
				aboutItem.date,
				aboutItem.description,
				aboutItem.itemData
			).subscribe((response: HttpResponse<TableAboutItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item with null values')
					.toEqual(aboutItem);
			});

			const req = httpTestingController.expectOne(`${service.uri}/update`);
			expect(req.request.method)
				.withContext('Expect the request method to be PUT')
				.toBe('PUT');
			expect(req.request.body)
				.withContext('Expect the request body to be the item')
				.toEqual({
					id: aboutItem.id,
					item_type: aboutItem.item_type,
					name: aboutItem.name,
					date: aboutItem.date,
					description: aboutItem.description,
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

			req.flush(aboutItem);
		});
	});


	describe('deleteItem()', () => {
		it('should send a DELETE request', () => {
			const token: string = 'Bearer random generated jwt',
			id: number = 1;

			service.deleteItem(
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