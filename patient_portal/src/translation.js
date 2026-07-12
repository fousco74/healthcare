import { frappeRequest } from 'frappe-ui'

// Message map for the current language, loaded once at startup from Frappe.
let messages = {}

// Fetch the translation dictionary for the logged-in user's language.
// Source: healthcare.api.patient_portal.get_translations -> frappe get_messages_for_boot()
// which aggregates app translation CSVs (e.g. healthcare/translations/fr.csv) + Translation doctype.
export async function loadTranslations() {
	try {
		const res = await frappeRequest({
			url: '/api/method/healthcare.healthcare.api.patient_portal.get_translations',
			method: 'GET',
		})
		messages = res || {}
	} catch (e) {
		// Fall back to source (English) strings if translations can't be loaded.
		messages = {}
	}
}

function format(message, replace) {
	if (replace === undefined || replace === null) return message
	if (Array.isArray(replace)) {
		return message.replace(/\{(\d+)\}/g, (m, i) => (replace[i] !== undefined ? replace[i] : m))
	}
	if (typeof replace === 'object') {
		return message.replace(/\{(\w+)\}/g, (m, k) => (replace[k] !== undefined ? replace[k] : m))
	}
	return message
}

// Frappe-style translation helper: __(text, replace, context)
export function translate(text, replace = null, context = null) {
	let message = text
	if (context && messages[`${text}:${context}`] !== undefined) {
		message = messages[`${text}:${context}`]
	} else if (messages[text] !== undefined) {
		message = messages[text]
	}
	return format(message, replace)
}

// Vue plugin: exposes __() in templates (globalProperties) and globally (window.__)
export const translationPlugin = {
	install(app) {
		app.config.globalProperties.__ = translate
		app.provide('$__', translate)
		if (typeof window !== 'undefined') window.__ = translate
	},
}
