import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.scss']
})
export class NetworkingComponent implements OnInit {

  users;
  constructor(private Auth: AngularFireAuth, private db: AngularFirestore) {
    this.users = this.db.collection('users').valueChanges();
  }

  ngOnInit() {
  }

}
