import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DeviceTypeAddComponent } from 'src/app/device-management/device-type/device-type-add/device-type-add.component';
import { DiseaseService } from 'src/app/settings-management/services/disease.service';

@Component({
  selector: 'app-edit-baseline-bp',
  templateUrl: './edit-baseline-bp.component.html',
  styleUrls: ['./edit-baseline-bp.component.scss']
})
export class EditBaselineBpComponent implements OnInit {

  deviceTypeForm: FormGroup;

	initializeCreateDeviceForm() {
		this.deviceTypeForm = this.fb.group({
			baseLineSys: [this.data.data,Validators.compose([Validators.required, Validators.max(500),Validators.min(30)])],
			// type: ["", Validators.required]
			// vendor: ["", Validators.required],
			// manfdate: ["", Validators.required],
			// version: ["", Validators.required],
			baseLineDia: [this.data.dia, Validators.compose([Validators.required, Validators.max(500),Validators.min(30)])]
		});
	}

	// statuslist = [
	// 	{ value: "Active", viewValue: "Active" },
	// 	{ value: "Inactive", viewValue: "Inactive" },
	// ];
	constructor(
		// private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<DeviceTypeAddComponent>,
		private diseaseService: DiseaseService,
		private snackBar: SnackbarService
	) {}

	ngOnInit(): void {

    
		this.initializeCreateDeviceForm();
	}

	createDeviceType() {
		if (this.deviceTypeForm.valid) {
			// console.warn(this.deviceTypeForm.value);
			this.diseaseService.editbaselineBp(this.deviceTypeForm.value,this.data.id).subscribe((res) => {
				this.snackBar.success('Baseline BP edited sucessfully', 2000);
				this.dialogRef.close();
        
				
			  }, error => {
				this.snackBar.error(error.message);
		  
			  });

		} else {
		}
	}
 
}
