import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectViewRoutingModule } from './object-view-routing.module';
import { ObjectViewMainComponent } from './object-view-main/object-view-main.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddACLObjViewComponent } from './add-acl/add-objview-acl.component';
import { JsonComparisonComponent } from './json-comparison/json-comparison.component';
import { SelectDownloadComponent } from './select-download/select-download.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MaterialDesignFrameworkModule } from '@ajsf/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DeleteObjectComponent } from './delete-object/delete-object.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule as AppCommonModule } from '../common/common.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AssociatedObjectsComponent } from './associated-objects/associated-objects.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { AssociatedObjectListComponent } from './associated-object-list/associated-object-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatBadgeModule } from '@angular/material/badge';
import { AssociatedDocumentsComponent } from './associated-documents/associated-documents.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ObjectAclComponent } from './object-acl/object-acl.component';
import { AclListComponent } from './acl-list/acl-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EditObjectComponent } from './edit-object/edit-object.component';
import { EditObjectContainerComponent } from './edit-object/edit-object-container/edit-object-container.component';
import { EditObjectPropertyComponent } from './edit-object/edit-object-property/edit-object-property.component';

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { EditObjectPropertyOneOffComponent } from './edit-object/edit-object-property-one-off/edit-object-property-one-off.component';
import { EditObjectPropertyStringComponent } from './edit-object/edit-object-property-string/edit-object-property-string.component';
import { EditObjectPropertyDateTimeComponent } from './edit-object/edit-object-property-date-time/edit-object-property-date-time.component';
import { EditObjectPropertyArrayComponent } from './edit-object/edit-object-property-array/edit-object-property-array.component';
import { EditObjectPropertyObjectComponent } from './edit-object/edit-object-property-object/edit-object-property-object.component';
import { EditObjectPropertyRefComponent } from './edit-object/edit-object-property-ref/edit-object-property-ref.component';
import { EditObjectPropertyAllOfComponent } from './edit-object/edit-object-property-all-of/edit-object-property-all-of.component';
import { EditObjectPropertyNumberComponent } from './edit-object/edit-object-property-number/edit-object-property-number.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddFieldComponent } from './edit-object/add-field/add-field.component';
import { AddArrayElementComponent } from './edit-object/add-array-element/add-array-element.component';
import { OneOfSelectComponent } from './edit-object/one-of-select/one-of-select.component';
import { EditPropertyDateComponent } from './edit-object/edit-property-date/edit-property-date.component';
import { MatSortModule } from '@angular/material/sort';
import { DisplayAttributesComponent } from './display-attributes/display-attributes.component';
import { MatTreeModule } from '@angular/material/tree';
import { EditObjectPropertyBooleanComponent } from './edit-object/edit-object-property-boolean/edit-object-property-boolean.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditObjectPropertyReferencedComponent } from './edit-object/edit-object-property-referenced/edit-object-property-referenced.component';
import { ObjectVersionsComponent } from './object-versions/object-versions.component';

@NgModule({
  declarations: [
    ObjectViewMainComponent,
    AddACLObjViewComponent,
    JsonComparisonComponent,
    SelectDownloadComponent,
    DeleteObjectComponent,
    AssociatedObjectsComponent,
    AssociatedObjectListComponent,
    AssociatedDocumentsComponent,
    ObjectAclComponent,
    AclListComponent,
    EditObjectComponent,
    EditObjectContainerComponent,
    EditObjectPropertyComponent,
    EditObjectPropertyOneOffComponent,
    EditObjectPropertyStringComponent,
    EditObjectPropertyDateTimeComponent,
    EditObjectPropertyArrayComponent,
    EditObjectPropertyObjectComponent,
    EditObjectPropertyRefComponent,
    EditObjectPropertyAllOfComponent,
    EditObjectPropertyNumberComponent,
    AddFieldComponent,
    AddArrayElementComponent,
    OneOfSelectComponent,
    EditPropertyDateComponent,
    DisplayAttributesComponent,
    EditObjectPropertyBooleanComponent,
    EditObjectPropertyReferencedComponent,
    ObjectVersionsComponent,
  ],
  imports: [
    CommonModule,
    ObjectViewRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatRippleModule,
    MatTabsModule,
    MatListModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatBadgeModule,
    MatRadioModule,
    MatSortModule,
    MaterialDesignFrameworkModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule,
    MatTreeModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    AppCommonModule,
    SweetAlert2Module.forChild(),
    AppCommonModule,
    NgxJsonViewerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
  ],
})
export class ObjectViewModule {}
