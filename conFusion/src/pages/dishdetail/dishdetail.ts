import { SocialSharing } from '@ionic-native/social-sharing';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../../pages/comment/comment';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {

  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    @Inject('BaseURL') private BaseURL,
    private favoriteservice: FavoriteProvider,
    private modalCtrl: ModalController,
    private socalSharing: SocialSharing ) {
      this.dish = navParams.get('dish');
      this.favorite = this.favoriteservice.isFavorite(this.dish.id);
      this.numcomments = this.dish.comments.length;

      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating);
      this.avgstars = (total/this.numcomments).toFixed(2);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }


  addToFavorites() {
    console.log('Adding to favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish '+ this.dish.id + " added as a favorite successfully",
      position: 'middle',
      duration: 3000
    }).present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add To Favorites',
          handler: () => {
            this.addToFavorites();
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            console.log('Add Comment clicked');
            this.openCommentModal();
          }
        },
        {
          text: 'Share via Facebook',
          handler: () => {
            this.socalSharing.shareViaFacebook(
              this.dish.name + ' -- ' + this.dish.description,
              this.BaseURL + this.dish.image, ''
            )
            .then(() => console.log('posted successfully to Facebook' ))
            .catch(() => console.log('failed to post to Facebook'));
          }
        },
        {
          text: 'Share via Twitter',
          handler: () => {
            this.socalSharing.shareViaTwitter(
              this.dish.name + ' -- ' + this.dish.description,
              this.BaseURL + this.dish.image, ''
            )
            .then(() => console.log('posted successfully to Twitter' ))
            .catch(() => console.log('failed to post to Twitter'));
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  openCommentModal() {
    let modal = this.modalCtrl.create(CommentPage);
    modal.onDidDismiss(comment => {
      console.log('Commnt added '+comment);
      if(comment) {
        this.dish.comments.push(comment);
      }
    });
    modal.present();
  }
}
