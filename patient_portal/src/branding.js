import { frappeRequest } from 'frappe-ui'
import { reactive } from 'vue'

// Per-site brand (name, logo, primary color). Empty on sites without branding (default theme).
export const brand = reactive({ name: '', logo: '', color: '' })

function hexToRgb(hex) {
	hex = hex.replace('#', '')
	if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
	const n = parseInt(hex, 16)
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function mix(rgb, target, w) {
	return rgb.map((c, i) => Math.round(c * (1 - w) + target[i] * w))
}
function rgbStr(rgb) {
	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

// Fetch branding and, if a primary color is set, override the theme CSS variables so the
// whole portal (buttons, calendar, slots, cards, headings) follows the brand color.
export async function loadBranding() {
	try {
		const b = await frappeRequest({
			url: '/api/method/healthcare.healthcare.api.patient_portal.get_branding',
			method: 'GET',
		})
		if (!b) return
		brand.name = b.name || ''
		brand.logo = b.logo || ''
		brand.color = b.color || ''

		if (b.color) {
			const base = hexToRgb(b.color)
			const white = [255, 255, 255]
			const black = [0, 0, 0]
			const root = document.documentElement.style
			root.setProperty('--hc-primary', rgbStr(base))
			root.setProperty('--hc-primary-dark', rgbStr(mix(base, black, 0.18)))
			root.setProperty('--hc-primary-light', rgbStr(mix(base, white, 0.45)))
			root.setProperty('--hc-primary-50', rgbStr(mix(base, white, 0.94)))
			root.setProperty('--hc-primary-100', rgbStr(mix(base, white, 0.88)))
			root.setProperty('--hc-ring', `rgba(${base[0]}, ${base[1]}, ${base[2]}, 0.30)`)
			root.setProperty('--hc-bg', rgbStr(mix(base, white, 0.965)))
		}
	} catch (e) {
		// keep default theme on failure
	}
}
