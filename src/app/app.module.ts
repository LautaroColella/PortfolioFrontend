import { AboutComponent } from '@@pages/about/about.component';
import { AdminComponent } from '@@pages/admin/admin.component';
import { AdminAboutComponent } from '@@pages/admin/views/admin-about/admin-about.component';
import { AdminContactComponent } from '@@pages/admin/views/admin-contact/admin-contact.component';
import { AdminHomeComponent } from '@@pages/admin/views/admin-home/admin-home.component';
import { AdminUserComponent } from '@@pages/admin/views/admin-user/admin-user.component';
import { AdminWorkComponent } from '@@pages/admin/views/admin-work/admin-work.component';
import { ContactComponent } from '@@pages/contact/contact.component';
import { IndexComponent } from '@@pages/index/index.component';
import { LoginComponent } from '@@pages/login/login.component';
import { WorkComponent } from '@@pages/work/work.component';
import { LoaderModule } from '@@shared/loader/loader.module';
import { NavbarComponent } from '@@shared/navbar/navbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpErrorInterceptor } from './interceptors/error-and-cache.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';

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
		AdminContactComponent,
		AdminUserComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		LoaderModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoaderInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
