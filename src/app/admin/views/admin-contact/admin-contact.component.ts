import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { ContactService } from '../../../rest/contact.service';

@Component({
  selector: 'app-admin-contact',
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.scss']
})
export class AdminContactComponent implements OnInit{

  constructor(private router: Router, private cookieService: CookieService, private contactService: ContactService) { }

  error_message_add: string = "";
  error_message_edit: string = "";
  error_message_delete: string = "";
  current_value: string = "add";
  found_item_id: boolean = false;
  item_to_edit: any = {};
  current_message: any = {};
  all_messages: any = [];


  reset_default_values(): void {
    this.error_message_add    = "";
    this.error_message_edit   = "";
    this.error_message_delete = "";
    this.current_value        = "add";
    this.found_item_id        = false;
  }

  method_change(event: any): void {
    const value = event.target.value;
    if(value !== this.current_value){
      if(value === "add"){
        this.reset_default_values();
        this.current_value = value;
      }
      else if(value === "edit"){
        this.reset_default_values();
        this.current_value = value;
      }
      else if(value === "delete"){
        this.reset_default_values();
        this.current_value = value;
      }
      else if(value === "message"){
        this.reset_default_values();
        this.current_value = value;
      }
    }
  }


  create_item(
    name: string,
    account: string,
    uri: string,
    image_uri: string,
    image_alt: string
  ): void {

    if(!name){
      this.error_message_add = "Field <name> can't be null";
    }
    else if(!account){
      this.error_message_add = "Field <account> can't be null";
    }

    else {
      if(!this.cookieService.get('JWT')){
        this.router.navigate(['login']);
      }
      else{
        const cookieValue: string = this.cookieService.get('JWT');
        this.contactService.createItem(cookieValue, name, account, uri, image_uri, image_alt)
        .subscribe((response: any) => {
          if(response === "0"){
            this.router.navigate(['login']);
          }
          else {
            this.router.navigate(['home']);
            this.error_message_add = "";
          }
        });
      }
    }
  }

  search_edit_item(inputId: string): void {
    const itemId = Number(inputId) || 0;
    if(itemId === 0){
      this.error_message_edit = "Invalid item id";
    }
    else if(itemId < 1){
      this.error_message_edit = "The item id must be greater than 0";
    }
    else if(itemId > 65535){
      this.error_message_edit = "The item id must be lesser than 65536";
    }
    else {
      this.contactService.getItem(itemId)
      .subscribe((response: any) => {
        if(response === "0"){
          this.router.navigate(['login']);
        }
        else {
          this.error_message_edit = "";
          this.found_item_id = true;
          this.item_to_edit = {
            id: response.body.id,
            name: response.body.name,
            account: response.body.account,
            uri: response.body.link,
            image_uri: response.body.image_uri,
            image_alt: response.body.image_alt
          }
        }
      });
    }
  }

  edit_item(
    name: string,
    account: string,
    uri: string,
    image_uri: string,
    image_alt: string
  ): void {
    if(!name){
      this.error_message_edit = "Field <name> can't be null";
    }
    else if(!account){
      this.error_message_edit = "Field <account> can't be null";
    }
    else {
      if(this.item_to_edit.name){
        let something_changed: boolean = false;
        if(name !== this.item_to_edit.name){
          something_changed = true;
        }
        if(account !== this.item_to_edit.account){
          something_changed = true;
        }
        if(uri !== this.item_to_edit.uri){
          something_changed = true;
        }
        if(image_uri !== this.item_to_edit.image_uri){
          something_changed = true;
        }
        if(image_alt !== this.item_to_edit.image_alt){
          something_changed = true;
        }

        if(something_changed){
          if(!this.cookieService.get('JWT')){
            this.router.navigate(['login']);
          }
          else{
            const cookieValue: string = this.cookieService.get('JWT');
            this.contactService.updateItem(cookieValue, this.item_to_edit.id, name, account, uri, image_uri, image_alt)
            .subscribe((response: any) => {
              if(response === "0"){
                this.router.navigate(['login']);
              }
              else {
                this.router.navigate(['home']);
                this.error_message_edit = "";
              }
            });
          }
        }
        else {
          this.error_message_edit = "Item not edited";
        }
      }
      else {
        this.error_message_edit = "Item to update not found";
        this.found_item_id = false;
      }
    }
  }

  delete_item(inputId: string): void {
    const itemId = Number(inputId) || 0;
    if(itemId === 0){
      this.error_message_delete = "Invalid item id";
    }
    else if(itemId < 1){
      this.error_message_delete = "The item id must be greater than 0";
    }
    else if(itemId > 65535){
      this.error_message_delete = "The item id must be lesser than 65536";
    }
    else {
      if(!this.cookieService.get('JWT')){
        this.router.navigate(['login']);
      }
      else{
        const cookieValue: string = this.cookieService.get('JWT');
        this.contactService.deleteItem(cookieValue, itemId)
        .subscribe((response: any) => {
          if(response === "0"){
            this.router.navigate(['login']);
          }
          else {
            this.router.navigate(['home']);
            this.error_message_delete = "";
          }
        });
      }
    }
  }


  show_message(id: number){
    if(!this.cookieService.get('JWT')){
      this.router.navigate(['login']);
    }
    else{
      const cookieValue: string = this.cookieService.get('JWT');
      this.contactService.getMessage(cookieValue, id)
      .subscribe((response: any) => {
        if(response === "0"){
          this.router.navigate(['login']);
        }
        else {
          this.current_message = {
            id: response.body.id,
            subject: response.body.subject,
            message: response.body.message,
            reply: response.body.reply,
            date: response.body.date,
            read: response.body.read
          }
          if(!response.body.read){
            this.contactService.changeMessageRead(cookieValue, this.current_message)
            .subscribe((response: any) => {
              if(response === "0"){
                this.router.navigate(['login']);
              }
            });
          }
        }
      });
    }
  }


  ngOnInit(): void {
    if(!this.cookieService.get('JWT')){
      this.router.navigate(['login']);
    }
    else{
      const cookieValue: string = this.cookieService.get('JWT');
      this.contactService.getMessages(cookieValue)
      .subscribe((response: any) => {
        if(response === "0"){
          this.router.navigate(['login']);
        }
        else {
          for(let i: number = 0; i < response.body.length; i++){
            this.all_messages.push({
              id: response.body[i].id,
              subject: response.body[i].subject,
              date: response.body[i].date,
              read: response.body[i].read
            });
          }
          this.all_messages.sort(function (a: any, b: any){
            return +new Date(b.date) - +new Date(a.date);
          });
        }
      });
    }
  }


}
