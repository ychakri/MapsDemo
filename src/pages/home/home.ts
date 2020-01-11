import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { AlertController } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,

  Marker,
  MyLocation,
  Geocoder,
  BaseArrayClass,
  GeocoderResult,
  ILatLng
} from '@ionic-native/google-maps';
import { MapsServiceProvider } from '../../providers/maps-service/maps-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  location: any;
  map: GoogleMap;
  locationAddress: Array<any> = []
  marker: Marker;
  isRunning: boolean = false;
  
  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private device: Device,
    public mapsService: MapsServiceProvider,
    public platform: Platform,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {

  }


  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.loadMap();
      this.getDetails();
    });
  }

  loadMap() {
    let options: GoogleMapOptions = {
      controls: {
        compass: true,
        myLocation: true,
      },
      camera: {
        target: { "lat": 15.9129, "lng": 79.7400 },
      },
      preferences: {
        zoom: {
          maxZoom: 17,
          minZoom: 5
        }
      }
    }
    this.map = GoogleMaps.create('map_canvas', options);
  }

  userLocationMap() {
    this.map.clear();
this.map.getMyLocation().then((location:MyLocation)=>{
  this.map.animateCamera({
    target: location.latLng,
    zoom: 10,
    tilt: 30
  });
})
  }

  addMarker(location) {
    let pos: ILatLng = {
      lat: location.latitude,
      lng: location.longitude
    };
    if (this.marker) {
      this.marker = null;
    }
    this.marker = this.map.addMarkerSync({
      'position': pos,
      animation: 'DROP',
      'title': "User"+location.id,
      draggable: false,
    })
   
    this.map.animateCamera({
      'target': this.marker.getPosition(),
      'zoom': 17
    }).then(() => {
      this.marker.showInfoWindow();
    })
  }

  onMarkerClick(params: any[]) {
    let marker: Marker = params[1];
    marker.showInfoWindow();
  }

  getDetails() {
    this.locationAddress=[]
    this.mapsService.getUserDetails().subscribe((result) => {
      this.locationAddress = result.data;
    })
  }

  getLocation(location){
    console.log(location)
    this.addMarker(location);
  }

  submitUser() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.geolocation.getCurrentPosition().then((data) => {
      let userDetail = {
        action: 'new_device',
        deviceid: this.device.uuid,
        manufacturer: this.device.manufacturer,
        latitude: data.coords.latitude,
        longitude: data.coords.longitude
      }
      this.mapsService.postUserDetails(userDetail).subscribe((result) => {
        loading.dismiss();
        if(result.status=="OK"){
          let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: 'Location updated successfully',
            buttons: ['Dismiss']
          });
          alert.present();
          this.getDetails();
        }
      })
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

}