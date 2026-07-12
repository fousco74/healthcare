// Show the Koralis Health brand on the module sidebar.
//
// For any desk page that is not an explicit item of a named Workspace Sidebar,
// Frappe falls back to an auto-generated sidebar titled after the *technical
// module* — here "Healthcare" (see auto_generate_sidebar_from_module). The
// module cannot be renamed without breaking the app, so we remap that title to
// the brand name at the sidebar-resolution layer. Every Healthcare page then
// shows the "Koralis Health" sidebar (its header, logo and items) instead of
// the raw "Healthcare" one.

const MODULE_TITLE = "Healthcare";
const BRAND_TITLE = "Koralis Health";

function patch_sidebar() {
	const proto = frappe.ui.Sidebar && frappe.ui.Sidebar.prototype;
	if (!proto || proto._koralis_branding_patched) {
		return !!proto;
	}
	proto._koralis_branding_patched = true;

	const resolve_module_sidebar = proto.resolve_module_sidebar;
	proto.resolve_module_sidebar = function (module) {
		const sidebar = resolve_module_sidebar.call(this, module);
		return sidebar === MODULE_TITLE ? BRAND_TITLE : sidebar;
	};

	const get_workspace_sidebars = proto.get_workspace_sidebars;
	proto.get_workspace_sidebars = function (link_to) {
		return get_workspace_sidebars
			.call(this, link_to)
			.map((title) => (title === MODULE_TITLE ? BRAND_TITLE : title));
	};

	// Safety net for any other path that still resolves to the raw module name.
	const setup = proto.setup;
	proto.setup = function (workspace_title) {
		return setup.call(this, workspace_title === MODULE_TITLE ? BRAND_TITLE : workspace_title);
	};

	return true;
}

// frappe.ui.Sidebar may not be defined yet when this bundle runs; retry briefly.
if (!patch_sidebar()) {
	const timer = setInterval(() => {
		if (patch_sidebar()) {
			clearInterval(timer);
		}
	}, 50);
	setTimeout(() => clearInterval(timer), 5000);
}
