import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceRequestRoutingModule } from './service-request-routing.module';
import { ServiceRequestComponent } from './service-request.component';
import { NewServiceRequestComponent } from './new-service-request/new-service-request.component';
import { ServiceRequestsComponent } from './service-requests/service-requests.component';

import { SharedModule } from '../../shared/shared.module';
import { ServiceRequestDetailsComponent } from './service-request-details/service-request-details.component';

@NgModule({
  declarations: [ServiceRequestComponent, NewServiceRequestComponent, ServiceRequestsComponent, ServiceRequestDetailsComponent],
  imports: [
    CommonModule,
    ServiceRequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
})
export class ServiceRequestModule { }
