frappe.ui.form.on("User", {
	refresh: function (frm) {
		frm.set_df_property("module_profile", "read_only", 1);
		if (!frm.doc.module_profile) {
			frm.set_value("module_profile", "Koralis Santé");
		}
	},
});
