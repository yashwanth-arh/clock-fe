import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
	{
		path: "",
		// component: LogHistoryCountComponent,
		data: {
			preload: true,
			breadcrumb: "Clinics",
			actionName: "Add Clinic",
			title: "Clinics",
			showActionBtn: true,
		},
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LogHistoryRoutingModule {}
