<template>
	<div class="h-full w-full select-none">
		<!-- Header -->
		<div class="flex justify-between items-center mb-4 px-1">
			<button type="button" @click="prevMonth"
				class="h-9 w-9 rounded-full flex items-center justify-center hc-nav-btn transition">
				<FeatherIcon name="chevron-left" class="w-4 h-4" />
			</button>
			<div class="text-base font-semibold text-slate-800 capitalize">{{ monthYear }}</div>
			<button type="button" @click="nextMonth"
				class="h-9 w-9 rounded-full flex items-center justify-center hc-nav-btn transition">
				<FeatherIcon name="chevron-right" class="w-4 h-4" />
			</button>
		</div>

		<!-- Weekdays -->
		<div class="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 mb-2">
			<div v-for="w in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="w"
				:class="w==='Su'||w==='Sa' ? 'text-rose-400' : ''">{{ __(w) }}</div>
		</div>

		<!-- Days -->
		<div class="grid grid-cols-7 gap-1 text-center place-items-center">
			<div v-for="blank in blanks" :key="'b-'+blank"></div>
			<div v-for="day in days" :key="day"
				@click="!isPast(day) && selectDay(day)"
				class="hc-day h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition"
				:class="[
					isPast(day) ? 'text-slate-300 cursor-not-allowed' : 'cursor-pointer text-slate-700',
					isAvailable(day) && activeDay !== day ? 'hc-day--available' : '',
					isToday(day) && activeDay !== day ? 'hc-day--today' : '',
					activeDay === day ? 'hc-day--selected' : '',
				]">
				{{ day }}
			</div>
		</div>

		<!-- Legend -->
		<div class="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
			<span class="inline-block w-2 h-2 rounded-full bg-brand-dot"></span>
			{{ __('Available days') }}
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FeatherIcon } from 'frappe-ui'
import { translate as __ } from '@/translation'

const props = defineProps({
	availableWeekdays: { type: Array, default: () => [] },
})

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const today = ref(new Date())
const activeDay = ref(null)

const emit = defineEmits(["update:selectedDate"])

// Days in the current month
const days = computed(() => {
	const numDays = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
	return Array.from({ length: numDays }, (_, i) => i + 1)
})

// Blank cells before the 1st for week alignment
const blanks = computed(() => {
	const startDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
	return startDay === 0 ? [] : Array(startDay).fill('')
})

const monthYear = computed(() => {
	return `${new Date(currentYear.value, currentMonth.value).toLocaleString('fr-FR', { month: 'long' })} ${currentYear.value}`
})

const isToday = (day) => {
	const date = new Date(currentYear.value, currentMonth.value, day)
	return date.getDate() === today.value.getDate() &&
		date.getMonth() === today.value.getMonth() &&
		date.getFullYear() === today.value.getFullYear()
}

const isPast = (day) => {
	const date = new Date(currentYear.value, currentMonth.value, day)
	return date < today.value && !isToday(day)
}

// A day is "available" if the practitioner's schedule covers its weekday and it isn't in the past
const isAvailable = (day) => {
	if (isPast(day)) return false
	const date = new Date(currentYear.value, currentMonth.value, day)
	return props.availableWeekdays.includes(WEEKDAY_NAMES[date.getDay()])
}

function prevMonth() {
	activeDay.value = null
	emit("update:selectedDate", null)
	if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value -= 1 }
	else currentMonth.value--
}

function nextMonth() {
	activeDay.value = null
	emit("update:selectedDate", null)
	if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value += 1 }
	else currentMonth.value++
}

function selectDay(day) {
	activeDay.value = day
	emit("update:selectedDate", formatDate(day))
}

function formatDate(day) {
	const selectedDate = new Date(currentYear.value, currentMonth.value, day)
	const y = selectedDate.getFullYear()
	const m = String(selectedDate.getMonth() + 1).padStart(2, '0')
	const d = String(selectedDate.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}
</script>
