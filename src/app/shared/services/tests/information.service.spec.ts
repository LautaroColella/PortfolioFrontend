import { TestBed } from '@angular/core/testing';
import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import {
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
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

	it('should send one GET request to the information endpoint', () => {
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

		const req = httpTestingController.expectOne(service.uri);
		expect(req.request.method)
			.withContext('Expect the request method to be GET')
			.toBe('GET');

		req.flush([
			{
				id: 1,
				name: 'unknown name',
				information: 'unknown information'
			},
			{
				id: 2,
				name: 'unknown name',
				information: 'unknown information'
			}
		]);
	});


	it('should send one PUT request to the information endpoint - Success', () => {
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
		).subscribe(
			(response: HttpResponse<TableInfoRes>) => {
				expect(response.status)
					.withContext('Expect the response status to be 200')
					.toBe(200);
				expect(typeof response.body)
					.withContext('Expect the response body to be an object')
					.toBe('object');
				expect(response.body)
					.withContext('Expect the response object to match the information item')
					.toEqual(infoItem);
			},
			(error: HttpResponse<HttpErrorResponse>) => {
				fail('Expected success response, but received error response');
			}
		);

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
	/*
	make the two errors: bad token and bad request
	also see if there's a way to make a descriptive statement
	to differentiate between both errors in the same it block
	*/
});