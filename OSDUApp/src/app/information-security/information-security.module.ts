import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoSecurityComponent } from './info-security/info-security.component';
import { InfoSecurityRoutingModule } from './info-security-routing.module';

@NgModule({
  declarations: [InfoSecurityComponent],
  imports: [CommonModule, InfoSecurityRoutingModule],
})
export class InformationSecurityModule {}
