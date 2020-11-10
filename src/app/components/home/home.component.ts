import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../interfaces/marcador.interface';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CreateMarkerComponent } from '../create-marker/create-marker.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../providers/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Marcador>;
  marcadores: Observable<Marcador[]>;
  latitud = 22.0018822;
  longitud = -99.0125398;
  selectedMarker;
  insert1 = false;
  insert2 = false;

  constructor( public snackBar: MatSnackBar,
               public dialog: MatDialog,
               private afs: AngularFirestore,
               public auth: AuthService,
               private http: HttpClient ) {
                this.itemsCollection = this.afs.collection<Marcador>('marcadores');
                // this.marcadores = this.itemsCollection.valueChanges();
                this.marcadores = this.afs.collection<Marcador>('marcadores', ref => ref.where('usuarioId', '==', this.auth.usuario.uid))
                .valueChanges();
               }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  addMarkerFB(marcador: Marcador) {
    // console.log(marcador);
    // this.itemsCollection.add(marcador);
    this.itemsCollection.doc(marcador.id).set(marcador);
    if ( this.itemsCollection.doc(marcador.id).set(marcador) ){
      this.insert1 = true;
    }
  }

  addMarker2(marcador: Marcador ){
    const url = 'https://api-mssql.herokuapp.com/api/save-marker';
    const body = `longitud=${marcador.longitud}&latitud=${marcador.latitud}`;
    // const  headers = new  HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    // const marker = JSON.stringify( { longitud: marcador.longitud, latitud: marcador.latitud } );

    return this.http.post(url, body, { headers })
      .pipe(
        map( data => data)
      )
  }

  // tslint:disable-next-line: typedef
  addMarker(latitud, longitud) {

    const marker: any = {};
    // this.markers.push(marker);

    const dialogRef = this.dialog.open(CreateMarkerComponent, {
      width: '250px',
      data: { latitud, longitud }
  });

    dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
        // console.log(result);

        if (result) {
            const id = this.afs.createId();
            marker.latitud = latitud;
            marker.longitud = longitud;
            marker.id = id;
            marker.usuarioId = this.auth.usuario.uid;
            this.addMarkerFB(marker);
            // this.addMarkerFB(marker);
            this.addMarker2(marker).subscribe(
               (data) => {
                 this.insert2 = true;
                 if ( this.insert1 && this.insert2 ){
                  this.snackBar.open('Marcador guardado!', 'Cerrar', { duration: 2000 });
                 }else{
                  this.snackBar.open('Marcador no guardado!', 'Cerrar', { duration: 2000 });
                 }
               }, (error) => {
                 console.log(error);
               });
        }
    });
  }

  // tslint:disable-next-line: typedef
    deleteMarker(marcador){
      this.itemsCollection.doc(marcador.id).delete();
  }

}