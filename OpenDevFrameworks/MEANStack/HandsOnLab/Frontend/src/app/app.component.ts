import { Component } from '@angular/core';
import { ContactsService } from './contacts-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  contacts: Contact[];

  constructor(
    private contactsService: ContactsService
  ) { }

  getContacts(): void {
    this.contactsService
      .getContacts()
      .then(contacts => this.contacts = contacts);
  }


  ngOnInit(): void {
    this.getContacts();
  }

}

export class Contact {
  id: number;
  name: string;
  email: string;
}
