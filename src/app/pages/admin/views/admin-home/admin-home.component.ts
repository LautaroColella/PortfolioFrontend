import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { InformationService } from '@@shared/services/information.service';
import { AlertService } from '@@shared/services/alert.service';
import { TableInfoRes } from '@@shared/interfaces/tableInfoRes.interface';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface';

@Component({
	selector: 'app-admin-home',
	templateUrl: './admin-home.component.html',
	styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

	constructor(
		private alertService: AlertService, 
		private router: Router, 
		private cookieService: CookieService, 
		private informationService: InformationService
	) { }

	homeTitles: 		string | undefined = undefined;
	indexTitlesId: 	number = 0;
	cookieValue: 		string = this.cookieService.get('JWT');

	update(titles: string): void {
		if (this.homeTitles !== titles) {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else {
				this.informationService.editInformationTable(
					this.cookieValue,
					this.indexTitlesId,
					"index_titles",
					titles
				).subscribe(
					(response: HttpResponse<TableInfoRes>): void  => {
						this.alertService.myAlert("Titles updated successfully", 'success');
						this.homeTitles = titles;
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while updating information', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
		else {
			this.alertService.myAlert('Information not edited', 'danger');
		}
	}

	ngOnInit(): void {
		this.informationService.getInformationTable()
		.subscribe(
			(response: HttpResponse<TableInfoRes[]>): void  => {
				if (response.body !== null) {
					for (let i: number = 0; i < response.body.length; i++) {
						if (response.body[i].name === "index_titles" && response.body[i].information) {
							this.homeTitles = response.body[i].information;
							this.indexTitlesId = i + 1;
							break;
						}
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving the information table', 'danger');
				console.error(error.body?.error);
			}
		);
	}
}
