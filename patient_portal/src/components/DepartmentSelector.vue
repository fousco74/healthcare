<template>
	<div class="flex flex-col h-[99%] animate-fade-in">
		<div class="flex items-center justify-between py-4">
			<h2 class="text-md font-semibold text-brand">{{ __('Select a Department') }}</h2>

			<!-- Pagination -->
			<div class="flex items-center gap-2">
				<Button size="sm" :disabled="page === 1" @click="$emit('update:page', page - 1)">
					<FeatherIcon name="chevron-left" class="size-5 text-ink-white-7" />
				</Button>
				<span class="text-sm text-gray-600">{{ __('Page {0} of {1}', [page, totalPages]) }}</span>
				<Button size="sm" :disabled="page === totalPages" @click="$emit('update:page', page + 1)">
					<FeatherIcon name="chevron-right" class="size-5 text-ink-white-7" />
				</Button>
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
			<Card v-for="dept in items" :key="dept.name"
				class="hc-card hc-pick-card relative cursor-pointer !p-0 overflow-hidden"
				:class="selected === dept.department ? 'hc-card--selected' : ''"
				@click="$emit('update:selected', dept.department)"
			>
				<div v-if="selected === dept.department"
					class="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md z-20">
					<FeatherIcon name="check" class="w-4 h-4" />
				</div>
				<div class="hc-pick-media">
					<img v-if="dept.portal_image" :src="dept.portal_image"
						class="w-full h-32 object-cover bg-gray-100" />
					<div v-else
						class="w-full h-32 flex items-center justify-center text-gray-700 text-3xl font-semibold bg-gray-100">
						{{ dept.department.charAt(0).toUpperCase() }}
					</div>
					<span class="hc-pick-scrim"></span>
				</div>
				<div
					class="px-3 py-2.5 text-center font-medium text-base md:text-sm lg:text-base whitespace-nowrap overflow-hidden text-ellipsis">
					{{ __(dept.department) }}
				</div>
			</Card>
		</div>
	</div>
</template>

<script setup>
import { Card, Button } from "frappe-ui";
import { translate as __ } from '@/translation'

defineProps({
	items: Array,
	selected: String,
	page: Number,
	totalPages: Number
});
</script>
