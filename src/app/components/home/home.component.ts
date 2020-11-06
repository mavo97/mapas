import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../interfaces/marcador.interface';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CreateMarkerComponent } from '../create-marker/create-marker.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../providers/auth.service';


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

  constructor( public snackBar: MatSnackBar,
               public dialog: MatDialog,
               private afs: AngularFirestore,
               public auth: AuthService ) {
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
            this.snackBar.open('Marcador guardado', 'Cerrar', { duration: 2000 });
        }
    });
  }

  // tslint:disable-next-line: typedef
    deleteMarker(marcador){
      this.itemsCollection.doc(marcador.id).delete();
  }
}