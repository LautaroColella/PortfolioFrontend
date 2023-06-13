import { TestBed } from '@angular/core/testing';
import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import {
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { of } from 'rxjs';
import { InformationService } from '@@shared/services/information.service';
import { TableInfoRes } from '@@shared/interfaces/tableInfoRes.interface';

describe('InformationService', () => {
	let service: InformationService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [InformationService]
		});

		service = TestBed.inject(InformationService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});


	describe('getInformationTable()', () => {
		it('should send a GET request, return the items and update the cached table', () => {
			const responseTable = [
				{
					id: 1,
					name: 'Random data',
					information: 'Random data'
				},
				{
					id: 2,
					name: 'Random data',
					information: 'Random data'
				}
			];

			spyOn(service, 'getInformationTable').and.callThrough();

			service.getInformationTable().subscribe((response: HttpResponse<TableInfoRes[]>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(Array.isArray(response.body))
					.withContext('Expect the response body to be an array of objects')
					.toBe(true);
				expect(response.body)
					.withContext('Expect the response objects to contain id, name and information')
					.toContain(
						jasmine.objectContaining({
							id: jasmine.any(Number),
							name: jasmine.any(String),
							information: jasmine.any(String)
						})
					);
			});

			expect(service.getInformationTable)
				.withContext('Expect the service to be called')
				.toHaveBeenCalled();
			expect(service.getInformationTable)
				.withContext('Expect the service to be called only once')
				.toHaveBeenCalledTimes(1);

			const req = httpTestingController.expectOne(service.uri);
			expect(req.request.method)
				.withContext('Expect the request method to be GET')
				.toBe('GET');

			req.flush(responseTable);

			expect(service['cachedTable'])
				.withContext('Expect the cached table to be the response table')
				.toEqual(responseTable);
		});

		it('should return the cached table', () => {
			const cachedTable = [
				{
					id: 1,
					name: 'Random data',
					information: 'Random data'
				},
				{
					id: 2,
					name: 'Random data',
					information: 'Random data'
				}
			];
			service['cachedTable'] = cachedTable;

			spyOn(service, 'getInformationTable').and.callThrough();

			service.getInformationTable().subscribe((response: HttpResponse<TableInfoRes[]>) => {
				expect(response.body)
					.withContext('Expect the response body to be the cached table')
					.toEqual(cachedTable);
			});

			expect(service.getInformationTable)
				.withContext('Expect the service to be called')
				.toHaveBeenCalled();
			expect(service.getInformationTable)
				.withContext('Expect the service to be called only once')
				.toHaveBeenCalledTimes(1);

			expect(service['cachedTable'])
				.withContext('Expect the cached table to not be modified')
				.toEqual(cachedTable);
		});
	});


	describe('editInformationTable()', () => {
		it('should send a PUT request and return the updated item', () => {
			const token: string = 'Bearer random generated jwt',
			infoItem = {
				id: 1,
				name: 'Random name',
				information: 'Random information'
			};

			service.editInformationTable(
				token,
				infoItem.id,
				infoItem.name,
				infoItem.information
			).subscribe((response: HttpResponse<TableInfoRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(typeof response.body)
					.withContext('Expect the response body to be an object')
					.toBe('object');
				expect(response.body)
					.withContext('Expect the response object to match the information item')
					.toEqual(infoItem);
			});

			const req = httpTestingController.expectOne(`${service.uri}/update`);
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

			req.flush(infoItem);
		});
	});
});