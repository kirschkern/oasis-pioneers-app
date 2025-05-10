<template>
    <div>
        <div class="row q-col-gutter-md">
            <!-- HAUPTSEASON -->
            <div class="col-12 col-md-4">
                <div class="text-h6">{{ $t('rentCalculator.mainResult') }}</div>
                <div>
                    {{ $t('rentCalculator.revenueFull') }}:
                    <b>{{ getCurrency(mainRevenueFull) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.revenue', { occupancy: mainOccupancy }) }}:
                    <b>{{ getCurrency(mainRevenue) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.costs') }}:
                    <b>{{ getCurrency(mainCosts) }}</b>
                    <q-btn
                        size="sm"
                        flat
                        color="primary"
                        :label="$t('rentCalculator.details')"
                        @click="$emit('show-main-cost-details')"
                    />
                </div>
                <div>
                    {{ $t('rentCalculator.profit') }}:
                    <b>{{ getCurrency(mainProfit) }}</b>
                </div>
                <div class="q-mt-sm text-bold">{{ $t('rentCalculator.share') }}</div>
                <div>
                    {{ $t('rentCalculator.shareAmount', { licenceFee: licenceFee }) }}
                    <b>{{ getCurrency(mainRuleLicenceFee) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.incomeAmount', { income: 100 - licenceFee }) }}
                    <b>{{ getCurrency(mainRuleIncome) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.taxTenant') }}
                    <b>{{ getCurrency(mainRuleTax) }}</b>
                </div>
                <div class="text-primary">
                    {{ $t('rentCalculator.afterTax') }}
                    <b>{{ getCurrency(mainRuleNetto) }}</b>
                </div>
            </div>

            <!-- NEBENSAISON -->
            <div class="col-12 col-md-4">
                <div class="text-h6">{{ $t('rentCalculator.offResult') }}</div>
                <div>
                    {{ $t('rentCalculator.revenueFull') }}:
                    <b>{{ getCurrency(offRevenueFull) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.revenue', { occupancy: offOccupancy }) }}:
                    <b>{{ getCurrency(offRevenue) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.costs') }}:
                    <b>{{ getCurrency(offCosts) }}</b>
                    <q-btn
                        size="sm"
                        flat
                        color="primary"
                        :label="$t('rentCalculator.details')"
                        @click="$emit('show-off-cost-details')"
                    />
                </div>
                <div>
                    {{ $t('rentCalculator.profit') }}:
                    <b>{{ getCurrency(offProfit) }}</b>
                </div>
                <div class="q-mt-sm text-bold">{{ $t('rentCalculator.share') }}</div>
                <div>
                    {{ $t('rentCalculator.shareAmount', { licenceFee: licenceFee }) }}
                    <b>{{ getCurrency(offRuleLicenceFee) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.incomeAmount', { income: 100 - licenceFee }) }}
                    <b>{{ getCurrency(offRuleIncome) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.taxTenant') }}
                    <b>{{ getCurrency(offRuleTax) }}</b>
                </div>
                <div class="text-primary">
                    {{ $t('rentCalculator.afterTax') }}
                    <b>{{ getCurrency(offRuleNetto) }}</b>
                </div>
            </div>

            <div class="col-12 col-md-4">
                <div class="text-h5">{{ $t('rentCalculator.total') }}</div>
                <div>
                    {{ $t('rentCalculator.totalRevenue') }}:
                    <b>{{ getCurrency(totalRevenue) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.totalCosts') }}:
                    <b>{{ getCurrency(totalCosts) }}</b>
                    <q-btn
                        size="sm"
                        flat
                        color="primary"
                        :label="$t('rentCalculator.details')"
                        @click="$emit('show-total-cost-details')"
                    />
                </div>
                <div>
                    {{ $t('rentCalculator.totalProfit') }}:
                    <b>{{ getCurrency(totalProfit) }}</b>
                </div>
                <div class="q-mt-sm text-bold">{{ $t('rentCalculator.share') }}</div>
                <div>
                    {{ $t('rentCalculator.shareAmount', { licenceFee: licenceFee }) }}
                    <b>{{ getCurrency(totalRuleLicenceFee) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.incomeAmount', { income: 100 - licenceFee }) }}
                    <b>{{ getCurrency(totalRuleIncome) }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.taxTenant') }}
                    <b>{{ getCurrency(totalRuleTax) }}</b>
                </div>
                <div class="text-primary">
                    {{ $t('rentCalculator.afterTax') }}
                    <b>{{ getCurrency(totalRuleNetto) }}</b>
                </div>
            </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="row justify-center">
            <RentCalculatorAmortization
                :total-rule-netto="totalRuleNetto"
                class="col-12 col-md-6 bg-primary-light q-pa-md rounded-borders bordered"
            />
        </div>
    </div>
</template>

<script setup>
import RentCalculatorAmortization from './RentCalculatorAmortization.vue'
import getCurrency from './getCurrency.js'

defineProps({
    mainRevenueFull: Number,
    mainOccupancy: Number,
    mainRevenue: Number,
    mainCosts: Number,
    mainProfit: Number,
    mainRuleLicenceFee: Number,
    mainRuleIncome: Number,
    mainRuleTax: Number,
    mainRuleNetto: Number,
    licenceFee: Number,
    offRevenueFull: Number,
    offOccupancy: Number,
    offRevenue: Number,
    offCosts: Number,
    offProfit: Number,
    offRuleLicenceFee: Number,
    offRuleIncome: Number,
    offRuleTax: Number,
    offRuleNetto: Number,
    totalRevenue: Number,
    totalCosts: Number,
    totalProfit: Number,
    totalRuleLicenceFee: Number,
    totalRuleIncome: Number,
    totalRuleTax: Number,
    totalRuleNetto: Number,
})
</script>
