import { createApp } from 'vue'
import PatientPortal from './PatientPortal.vue'
import { initSocket } from './socket'
import { loadTranslations, translationPlugin } from './translation'
import { loadBranding } from './branding'

import './index.css'

import {
	FrappeUI,
	Button,
	Dialog,
	Badge,
	setConfig,
	frappeRequest,
	FeatherIcon,
	Tooltip,
	Card
} from 'frappe-ui'

let globalComponents = {
	Button,
	Dialog,
	Badge,
	FeatherIcon,
	Tooltip,
	Card
}

let app = createApp(PatientPortal)
setConfig('resourceFetcher', frappeRequest)
app.use(FrappeUI)
app.use(translationPlugin)
app.provide('$socket', initSocket())

for (let key in globalComponents) {
	app.component(key, globalComponents[key])
}

// Fetch a valid CSRF token at startup so POST requests work regardless of how the
// page HTML is served (static build vs Jinja-rendered www page). GET needs no CSRF.
async function loadCsrfToken() {
	try {
		const token = await frappeRequest({
			url: '/api/method/healthcare.healthcare.api.patient_portal.get_csrf_token',
			method: 'GET',
		})
		if (token) window.csrf_token = token
	} catch (e) {
		// keep whatever token the page provided
	}
}

// Load csrf token + translations + per-site branding, then mount (falls back to defaults on failure).
Promise.allSettled([loadCsrfToken(), loadTranslations(), loadBranding()]).finally(() => app.mount('#app'))