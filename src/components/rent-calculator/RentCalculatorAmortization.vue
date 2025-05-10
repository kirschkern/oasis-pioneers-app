<template>
    <div class="rounded-borders">
        <div class="row items-center q-gutter-md">
            <div class="text-h5">Amortisations-Rechner</div>
            <q-space />
        </div>
        <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
                <div>Pachtbetrag: {{ getCurrency(leaseAmount, true) }}</div>
                <q-slider
                    v-model.number="leaseAmount"
                    type="number"
                    :min="0"
                    :max="50000"
                    :step="1000"
                    dense
                    label
                />
            </div>
            <div class="col-12 col-md-4">
                <div>Mobile Home(s): {{ getCurrency(mobileHomeAmount, true) }}</div>
                <q-slider
                    v-model.number="mobileHomeAmount"
                    type="number"
                    :min="0"
                    :max="200000"
                    :step="1000"
                    dense
                    label
                />
            </div>
            <div class="col-12 col-md-4">
                <div>Weitere Investitionen: {{ getCurrency(additionalInvestment, true) }}</div>
                <q-slider
                    v-model.number="additionalInvestment"
                    type="number"
                    :min="0"
                    :max="200000"
                    :step="1000"
                    dense
                    label
                />
            </div>

            <div class="col-12 col-md-4">
                <div>Laufzeit: {{ years }} Jahre</div>
                <q-slider v-model.number="years" :min="1" :max="20" :step="1" dense label />
            </div>

            <div class="col-12 col-md-4">
                <div>
                    <div>Investition gesamt:</div>
                    <div class="text-bold">
                        {{ getCurrency(totalInvestment, true) }}
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-4">
                <div>Break Even:</div>
                <div class="text-bold">{{ breakEvenYears }} Jahre</div>
            </div>

            <div class="col-12 col-md-4">
                <div>Gewinn (über {{ years }} Jahre):</div>
                <div class="text-bold">{{ getCurrency(totalNetProfit, true) }}</div>
            </div>

            <div class="col-12 col-md-4">
                <div>Gewinn nach Investition:</div>
                <div class="text-bold">
                    {{ getCurrency(totalNetProfit - totalInvestment, true) }}
                </div>
            </div>

            <div class="col-12 col-md-4">
                <div>Ø Gewinn/Jahr nach Investition:</div>
                <div class="text-bold">{{ getCurrency(avgNetProfit, true) }}</div>
            </div>

            <div class="col-12 col-md-4">
                <div>Rendite:</div>
                <div class="text-bold">
                    {{ rendement !== '' ? rendement + ' %' : '' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCurrency } from './helpers.js'
const props = defineProps({
    totalRuleNetto: { type: Number, required: true },
})
const leaseAmount = ref(25000)
const mobileHomeAmount = ref(20000)
const additionalInvestment = ref(10000)
const years = ref(10)

const totalInvestment = computed(
    () => leaseAmount.value + mobileHomeAmount.value + additionalInvestment.value,
)
const breakEvenYears = computed(() => {
    if (props.totalRuleNetto > 0) {
        return (totalInvestment.value / props.totalRuleNetto).toFixed(2)
    }
    return ''
})
const totalNetProfit = computed(() => props.totalRuleNetto * years.value)
const avgNetProfit = computed(() => {
    const invest = totalInvestment.value
    if (years.value > 0) {
        return ((totalNetProfit.value - invest) / years.value).toFixed(2)
    }
    return ''
})
const rendement = computed(() => {
    if (totalInvestment.value > 0) {
        return ((avgNetProfit.value / totalInvestment.value) * 100).toFixed(1)
    }
    return ''
})
</script>

<style scoped>
.q-input[readonly] input {
    background: #f5f5f5;
    color: #333;
}
</style>
