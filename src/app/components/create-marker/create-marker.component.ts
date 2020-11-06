import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-create-marker',
  templateUrl: './create-marker.component.html',
  styleUrls: ['./create-marker.component.css']
})
export class CreateMarkerComponent implements OnInit {

  marcador: any;

  constructor(  public dialogRef: MatDialogRef<CreateMarkerComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any ) {
                  // console.log(data);
                  this.marcador = { latitud: data.longitud, longitud: data.latitud  };
                 }

  ngOnInit(): void {
  }
  guardarMarcador() {
    this.dialogRef.close(this.marcador);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
