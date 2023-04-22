import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../services/login.service';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
	providers: [CookieService]
})
export class AdminComponent implements OnInit {

	constructor(private loginService: LoginService, private cookieService: CookieService, private router: Router){ }
	
	view_click(view: string): void {
		const elemView: HTMLElement | null = document.getElementById(`app_${view}`);
		let arrow: NodeListOf<ChildNode> | undefined = undefined;
		if(elemView !== null){
			const elemViewP: HTMLElement | null = elemView.parentElement;
			if(elemViewP !== null){
				const elemViewPC: ChildNode | null = elemViewP.firstChild;
				if(elemViewPC !== null){
					const elemViewPCC: ChildNode | null = elemViewPC.firstChild;
					if(elemViewPCC !== null){
						arrow = elemViewPCC.childNodes;
					}
				}
			}
			if(window.getComputedStyle(elemView, null).display === "none"){
				elemView.style.display = "block";
				if(arrow !== undefined){
					(arrow[1] as HTMLElement).style.display = "none";
					(arrow[2] as HTMLElement).style.display = "block";
				}
			}
			else{
				elemView.style.display = "none";
				if(arrow !== undefined){
					(arrow[1] as HTMLElement).style.display = "block";
					(arrow[2] as HTMLElement).style.display = "none";
				}
			}
		}
	}

	b_goto(gtPosition: string): void {
		const admElem:      HTMLElement | null = document.getElementById("admin");
		const home_elem:    HTMLElement | null = document.getElementById("app_home");
		const work_elem:    HTMLElement | null = document.getElementById("app_work");
		const about_elem:   HTMLElement | null = document.getElementById("app_about");
		const contact_elem: HTMLElement | null = document.getElementById("app_contact");
		if(admElem !== null){
			if(home_elem !== null && work_elem !== null && about_elem !== null && contact_elem !== null){
				if(gtPosition === "top" || gtPosition === "app_home"){
					admElem.scrollTop = 0;
					if(gtPosition === "top"){
						home_elem.style.display = "none";
						work_elem.style.display = "none";
						about_elem.style.display = "none";
						contact_elem.style.display = "none";

						const arrowsUp: HTMLElement[] = Array.from(document.getElementsByClassName("arrow_up") as HTMLCollectionOf<HTMLElement>);
						const arrowsDown: HTMLElement[] = Array.from(document.getElementsByClassName("arrow_down") as HTMLCollectionOf<HTMLElement>);
						for(let i: number = 0; i < arrowsUp.length; i++){
							arrowsUp[i].style.display = "none";
						}
						for(let i: number = 0; i < arrowsDown.length; i++){
							arrowsDown[i].style.display = "block";
						}
					}
				}
				else{
					const elemNav: HTMLElement | null = document.getElementById(gtPosition);
					if(elemNav !== null){
						if(elemNav.offsetTop > 120){
							admElem.scrollTop = elemNav.offsetTop - 120;
						}
						else{
							if(gtPosition === "app_work"){
								admElem.scrollTop = home_elem.clientHeight;
							}
							else if(gtPosition === "app_about"){
								admElem.scrollTop = home_elem.clientHeight + work_elem.clientHeight;
							}
							else if(gtPosition === "app_contact"){
								admElem.scrollTop = home_elem.clientHeight + work_elem.clientHeight + about_elem.clientHeight;
							}
						}
					}
				}
			}
		}
	}
	
	b_logout(): void {
		this.cookieService.delete("JWT", "/");
		this.router.navigate(['home']);
	}

	ngOnInit(): void {
		if(!this.cookieService.get('JWT')){
			this.router.navigate(['login']);
		}
		else{
			const cookieValue: string = this.cookieService.get('JWT');
			this.loginService.check_token(cookieValue)
			.subscribe((response: any): void  => {
				if(response === "0"){
					this.b_logout();
				}
			});
		}
	}
}