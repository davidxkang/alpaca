import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service'
import { Order } from '../shared/order';
import { User } from '../shared/user';
import { Upload } from '../shared/upload';
import { FirebaseListObservable } from 'angularfire2/database'; 
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

// => Do we need to import every time or just once in app component?
// => answer: Everytime you want to use it in a specific component, yes, and overall in app package. -N

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {  
  orders: Order[];
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  selectedFiles: FileList;
  upload: Upload;
  key: string;
  userInfo: User = new User();

  constructor(
    private orderService: OrderService, 
    private authService: AuthService, 
    private afAuth: AngularFireAuth, 
    private userService: UserService,
    private router: Router,
  ) {

  }

  ngOnInit() {

  
    // may need to define some static thing to order
    // this.orders = this.orderService.getOrdersList({limitToLast: 5});
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/'])
  }

  portfolio() {
    this.router.navigate(['archive'])
  }

  gohome() {
    this.router.navigate(['dashboard'])
  }


  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.upload = new Upload(this.selectedFiles.item(0))
  }

  updateAll() {
    this.userInfo.address = this.address ? this.address : null;
    this.userInfo.firstname = this.firstName;
    this.userInfo.lastname = this.lastName ? this.lastName : null;
    this.userInfo.email = this.email;

    console.log('User info being updated to: ', this.userInfo);
    // this.afAuth.auth.currentUser.updatePassword(this.password); //need another login prior to updating password
  
    this.userService.updateUserAllProperties(this.key, this.userInfo, this.upload);
  }

  getList() {
    this.orderService.getArchivedList()
      .subscribe((data) => {
        this.orders = data;
        console.log(this.orders)
        this.orderService.createTimestamp(this.orders);
        // this.orderService.populateImages(this.orders);
      })
  }

}
