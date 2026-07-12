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

// Load translations + per-site branding, then mount (falls back to defaults on failure).
Promise.allSettled([loadTranslations(), loadBranding()]).finally(() => app.mount('#app'))