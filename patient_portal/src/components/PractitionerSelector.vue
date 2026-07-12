<template>
	<div class="flex flex-col h-[99%] animate-fade-in">
		<div class="flex items-center justify-between py-4">
			<h2 class="text-md font-semibold py-2 text-brand">{{ __('Select a Practitioner') }}</h2>

			<!-- Pagination -->
			<div class="flex items-center gap-2">
				<Button size="sm" :disabled="page === 1" @click="$emit('update:page', page - 1)">
					<FeatherIcon name="chevron-left" class="size-5 text-ink-white-7" />
				</Button>
				<span class="text-sm text-gray-600 flex items-center">{{ __('Page {0} of {1}', [page, totalPages]) }}</span>
				<Button size="sm" :disabled="page === totalPages" @click="$emit('update:page', page + 1)">
					<FeatherIcon name="chevron-right" class="size-5 text-ink-white-7" />
				</Button>
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
			<Card v-for="doc in items" :key="doc.name"
				class="hc-card hc-pick-card relative cursor-pointer !p-0 overflow-hidden"
				:class="selected?.name === doc.name ? 'hc-card--selected' : ''"
				@click="$emit('update:selected', doc)"
			>
				<div v-if="selected?.name === doc.name"
					class="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md z-20">
					<FeatherIcon name="check" class="w-4 h-4" />
				</div>
				<div class="hc-pick-media">
					<img v-if="doc.image" :src="doc.image" class="w-full h-32 object-cover bg-gray-100" />
					<div v-else
						class="w-full h-32 flex items-center justify-center text-gray-700 text-3xl font-semibold bg-gray-100">
						{{ doc.practitioner_name.charAt(0).toUpperCase() }}
					</div>
					<span class="hc-pick-scrim"></span>
				</div>
				<div class="px-2 pt-2 pb-3 text-center">
					<div class="font-semibold text-base md:text-sm lg:text-base text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
						{{ doc.practitioner_name }}
					</div>
					<div v-if="doc.designation" class="text-xs text-gray-500 truncate">{{ doc.designation }}</div>
					<div class="text-xs text-brand truncate">{{ doc.department }}</div>
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
	selected: Object,
	page: Number,
	totalPages: Number
});
</script>
