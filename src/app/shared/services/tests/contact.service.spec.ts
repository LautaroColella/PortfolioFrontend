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

			service.getItem(id).subscribe((response: HttpResponse<TableContactItemRes>) => {
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
			});

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
			).subscribe((response: HttpResponse<TableContactItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item with id')
					.toEqual(contactItem);
			});

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
			).subscribe((response: HttpResponse<TableContactItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item with id')
					.toEqual(contactItem);
			});

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
			).subscribe((response: HttpResponse<TableContactItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item')
					.toEqual(contactItem);
			});

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
			).subscribe((response: HttpResponse<TableContactItemRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the item with null values')
					.toEqual(contactItem);
			});

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
			).subscribe((response: HttpResponse<{ }>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
			});

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


	describe('getMessage()', () => {
		it('should send a GET request and return the specific message', () => {
			const token: string = 'Bearer random generated jwt',
			id: number = 1;

			service.getMessage(
				token,
				id
			).subscribe((response: HttpResponse<TableContactMessageRes>) => {
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
							subject: jasmine.any(String),
							message: jasmine.any(String),
							reply: jasmine.any(String),
							date: jasmine.any(String),
							readed: jasmine.any(Boolean)
						})
					);
			});

			const req = httpTestingController.expectOne(`${service.uriCm}/${id}`);
			expect(req.request.method)
				.withContext('Expect the request method to be GET')
				.toBe('GET');

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

			req.flush(
				{
					id: 1,
					subject: "Valid data",
					message: "Valid data",
					reply: "Valid data",
					date: "Valid data",
					readed: false
				}
			);
		});
	});


	describe('getMessages()', () => {
		it('should send a GET request and return the messages', () => {
			const token: string = 'Bearer random generated jwt',
			responseMessages = [
				{
					id: 1,
					subject: 'Valid data',
					message: 'Valid data',
					reply: 'Valid data',
					date: 'Valid data',
					readed: false
				},
				{
					id: 2,
					subject: 'Valid data',
					message: 'Valid data',
					reply: 'Valid data',
					date: 'Valid data',
					readed: false
				}
			];

			service.getMessages(token).subscribe((response: HttpResponse<TableContactMessageRes[]>) => {
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
							subject: jasmine.any(String),
							message: jasmine.any(String),
							reply: jasmine.any(String),
							date: jasmine.any(String),
							readed: jasmine.any(Boolean)
						})
					);
			});

			const req = httpTestingController.expectOne(service.uriCm);
			expect(req.request.method)
				.withContext('Expect the request method to be GET')
				.toBe('GET');

			req.flush(responseMessages);
		});
	});


	describe('createMessage()', () => {
		it('should send a POST request and return the created message', () => {
			const contactMessage = {
				id: 1,
				subject: 'Valid data',
				message: 'Valid data',
				reply: 'Valid data',
				date: 'Valid data',
				readed: false
			};

			service.createMessage(
				contactMessage.subject,
				contactMessage.message,
				contactMessage.reply,
				contactMessage.date
			).subscribe((response: HttpResponse<TableContactMessageRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to be the message')
					.toEqual(contactMessage);
			});

			const req = httpTestingController.expectOne(`${service.uriCm}/add`);
			expect(req.request.method)
				.withContext('Expect the request method to be POST')
				.toBe('POST');
			expect(req.request.body)
				.withContext('Expect the request body to be the message')
				.toEqual({
					subject: contactMessage.subject,
					message: contactMessage.message,
					reply: contactMessage.reply,
					date: contactMessage.date,
					readed: contactMessage.readed
				});

			req.flush(contactMessage);
		});
	});


	describe('deleteMessage()', () => {
		it('should send a DELETE request', () => {
			const token: string = 'Bearer random generated jwt',
			id: number = 1;

			service.deleteMessage(
				token,
				id
			).subscribe((response: HttpResponse<{ }>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
			});

			const req = httpTestingController.expectOne(`${service.uriCm}/delete/${id}`);
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


	describe('changeMessageRead()', () => {
		it('should send a PUT request and return the new message', () => {
			const token: string = 'Bearer random generated jwt',
			contactMessage = {
				id: 1,
				subject: 'Valid data',
				message: 'Valid data',
				reply: 'Valid data',
				date: 'Valid data',
				readed: false
			};

			service.changeMessageRead(
				token,
				contactMessage
			).subscribe((response: HttpResponse<TableContactMessageRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(response.body)
					.withContext('Expect the response body to equal the message with the readed variable toggled')
					.toEqual({
						id: contactMessage.id,
						subject: contactMessage.subject,
						message: contactMessage.message,
						reply: contactMessage.reply,
						date: contactMessage.date,
						readed: true
					});
			});

			const req = httpTestingController.expectOne(`${service.uriCm}/update`);
			expect(req.request.method)
				.withContext('Expect the request method to be PUT')
				.toBe('PUT');

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

			req.flush({
				id: contactMessage.id,
				subject: contactMessage.subject,
				message: contactMessage.message,
				reply: contactMessage.reply,
				date: contactMessage.date,
				readed: true
			});
		});
	});
});