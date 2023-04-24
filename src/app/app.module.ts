import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { IndexComponent } from './index/index.component';
import { WorkComponent } from './work/work.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminHomeComponent } from './admin/views/admin-home/admin-home.component';
import { AdminWorkComponent } from './admin/views/admin-work/admin-work.component';
import { AdminAboutComponent } from './admin/views/admin-about/admin-about.component';
import { AdminContactComponent } from './admin/views/admin-contact/admin-contact.component';
import { HttpErrorInterceptor } from './interceptors/error-handling.interceptor';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		IndexComponent,
		WorkComponent,
		AboutComponent,
		ContactComponent,
		LoginComponent,
		AdminComponent,
		AdminHomeComponent,
		AdminWorkComponent,
		AdminAboutComponent,
		AdminContactComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule
	],
	providers: [{
		provide: HTTP_INTERCEPTORS,
		useClass: HttpErrorInterceptor,
		multi: true
	}],
	bootstrap: [AppComponent]
})
export class AppModule { }
