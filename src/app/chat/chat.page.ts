import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  providers: [NavParams]
})
export class ChatPage implements OnInit {

  public messages = [];
  public message;
  public user;


  constructor(private socket: Socket, navParams: NavParams, public modalCtrl: ModalController, public cd: ChangeDetectorRef) {

    this.user = navParams.get('user');

    socket.fromEvent('newMessage').subscribe((data:any) => {
      console.log('data received')
      console.log(data);
      this.messages.push(data);
      this.cd.detectChanges();
    });

  }

  ngOnInit() {

  }

  closeModal() {
    this.modalCtrl.dismiss();
}

  sendMessage() {
    console.log(this.message)
    this.socket.emit("send-message", {text: this.message, username: this.user.firstname})
  }
}
