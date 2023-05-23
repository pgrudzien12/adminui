import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefDataRoutingModule } from './ref-data-routing.module';
import { RefDataMainComponent } from './ref-data-main/ref-data-main.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [RefDataMainComponent],
  imports: [
    CommonModule,
    FormsModule,
    RefDataRoutingModule,
    NgSelectModule,
    FormsModule,
    MatCardModule,
  ],
})
export class RefDataMudule {}
