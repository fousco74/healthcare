<template>
	<div class="w-full h-full">
		<div v-if="brand.name || brand.logo" class="hc-brand-header">
			<img v-if="brand.logo" :src="brand.logo" class="hc-brand-logo" alt="logo" />
			<div>
				<div class="hc-brand-name">{{ brand.name || __('Patient Portal') }}</div>
				<div class="hc-brand-sub">{{ __('Patient Portal') }}</div>
			</div>
		</div>
		<div>
			<Tabs as="div" v-model="portal_tabs" :tabs="tabs">
				<template #tab-panel="{ tab }">
					<div v-if="tab.key == 'appointments'">
						<AppointmentModel />
					</div>
					<div v-else-if="tab.key == 'diagnostics'">
						<DiagnosticModel />
					</div>
				</template>
			</Tabs>
		</div>
	</div>

	<Dialog :options="{
		title: dialog_title,
		message: dialog_message,
		size: 'xl',
		icon: {
			name: 'alert-triangle',
			appearance: 'warning',
		},
		actions: [
			{
				label: __('OK'),
				variant: 'solid',
			},
		],
	}" v-model="alert_dialog" @click="alert_dialog = false" />
</template>

<script setup>
import { ref, computed } from 'vue'
import AppointmentModel from '@/components/AppointmentModel.vue'
import DiagnosticModel from '@/components/DiagnosticModel.vue'
import { translate as __ } from '@/translation'
import { brand } from '@/branding'

import {
	createResource,
	Tabs,
	Dialog,
} from 'frappe-ui'

let alert_dialog = ref(false);

const portal_tabs = ref(0);

let dialog_title = ref("");
let dialog_message = ref("");

let healthcareSettings = ref({});

let getHealthcareSettings = createResource({
	url: "/api/method/healthcare.healthcare.api.patient_portal.get_settings",
	method: "GET",
	onSuccess(response) {
		if (response) {
			healthcareSettings.value = response
		}
	},
});
getHealthcareSettings.fetch();

const tabs = computed(() => {
	let baseTabs = [{ key: 'appointments', label: __('Appointments') }]
	if (healthcareSettings.value.show_diagnostics_tab) {
		baseTabs.push({ key: 'diagnostics', label: __('Diagnostics') })
	}
	return baseTabs
})

let set_logged_in_patient = createResource({
	url: "/api/method/healthcare.healthcare.api.patient_portal.get_logged_in_patient",
	method: "GET",
	onSuccess(response) {
		if (response) {
			localStorage.setItem("patient", JSON.stringify(response));
		}
	},
	onError(error) {
		dialog_message = error.messages?.[0] || error;
		dialog_title = __("Failed to load appointments");
		alert_dialog.value = true;
	}
});
set_logged_in_patient.fetch();

</script>
