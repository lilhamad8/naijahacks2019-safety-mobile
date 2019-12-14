import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  public contacts: any[];
  public stringContacts: string;

  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(public userService: UserService) {
    this.contacts = this.userService.getContacts();
    if(this.contacts){
      this.stringContacts = this.contacts.toString();
    }
    
    console.log(this.stringContacts);
  }

  ngOnInit() {
  }

  addContact(){
    this.userService.setContacts(this.stringContacts.split(", "));
  }
}
