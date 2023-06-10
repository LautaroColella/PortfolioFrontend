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


	it('should send a GET request and update the cached items if it is null', () => {
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
	it('should return the cached items if it is not null', () => {
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


	it('should send one GET request to the about_item/$id endpoint - Success', () => {
		const id: number = 1;

		service.getItem(id).subscribe(
			(response: HttpResponse<TableAboutItemRes>) => {
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
			},
			(error: HttpResponse<HttpErrorResponse>) => {
				fail('Expected success response, but received error response');
			}
		);

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
	it('should send one GET request to the about_item/$id endpoint - Error', () => {
		const id: number = 1;

		service.getItem(id).subscribe(
			(response: HttpResponse<TableAboutItemRes>) => {
				fail('Expected error response, but received success response');
			},
			(error: HttpErrorResponse) => {
				expect(error.status)
					.withContext('Expect the error status to be 404')
					.toBe(404);
				expect(error.error)
					.withContext('Expect the error body to be an object with a specific error message')
					.toEqual({ message: 'An item with that id was not found in the database' });
			}
		);

		const req = httpTestingController.expectOne(`${service.uri}/${id}`);
		expect(req.request.method)
			.withContext('Expect the request method to be GET')
			.toBe('GET');

		req.flush(
			{
				message: 'An item with that id was not found in the database'
			},
			{
				status: 404,
				statusText: 'Not Found'
			}
		);
	});


	it('should send one POST request to the about_item/add endpoint - Success', () => {
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
		).subscribe(
			(response: HttpResponse<TableAboutItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item with id')
					.toEqual(aboutItem);
			},
			(error: HttpResponse<HttpErrorResponse>) => {
				fail('Expected success response, but received error response');
			}
		);

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
	xit('should send one POST request to the about_item/add endpoint - Error bad token', () => {
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
		).subscribe(
			(response: HttpResponse<TableAboutItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item with id')
					.toEqual(aboutItem);
			},
			(error: HttpResponse<HttpErrorResponse>) => {
				fail('Expected success response, but received error response');
			}
		);

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

		req.flush('', {
			status: 401,
			statusText: 'Unauthorized'
		});
	});
	xit('should send one POST request to the about_item/add endpoint - Error bad item', () => {

	});


	xit('should send one PUT request to the about_item/update endpoint - Success', () => {

	});
	xit('should send one PUT request to the about_item/update endpoint - Error bad token', () => {

	});
	xit('should send one PUT request to the about_item/update endpoint - Error bad item', () => {

	});


	xit('should send one DELETE request to the about_item/delete/$id endpoint - Success', () => {

	});
	xit('should send one DELETE request to the about_item/delete/$id endpoint - Error bad token', () => {

	});
	xit('should send one DELETE request to the about_item/delete/$id endpoint - Error bad id', () => {

	});
});