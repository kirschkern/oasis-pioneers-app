<template>
    <q-page class="q-pa-md">
        <div class="row q-mb-md items-center">
            <div class="text-h4">{{ $t('rentCalculator.title') }}</div>
            <q-space />
            <div class="row q-mb-md items-center">
                <q-select
                    v-if="store.savedEntries.length > 0"
                    v-model="store.selectedEntry"
                    :options="store.savedEntries"
                    option-label="name"
                    option-value="name"
                    :label="$t('rentCalculator.savedCalculations')"
                    dense
                    style="width: 150px"
                    class="q-mr-md"
                    @update:model-value="store.loadEntry"
                />
                <q-btn
                    v-if="store.selectedEntry"
                    color="primary"
                    icon="delete"
                    flat
                    @click="store.deleteEntry(store.selectedEntry)"
                />
                <q-btn
                    color="primary"
                    icon="save"
                    @click="showSaveDialog = true"
                    flat
                    :title="$t('rentCalculator.saveCalculation')"
                />
                <q-btn
                    color="primary"
                    icon="share"
                    flat
                    @click="shareCalculation"
                    :title="$t('rentCalculator.shareCalculation')"
                />
                <q-btn
                    color="primary"
                    icon="replay"
                    flat
                    @click="resetCalculator"
                    :title="$t('rentCalculator.resetCalculation')"
                />
                <q-btn
                    color="primary"
                    icon="info"
                    flat
                    @click="showInfo = !showInfo"
                    :title="'Info zur App anzeigen'"
                />
            </div>
        </div>

        <q-slide-transition>
            <div
                v-show="showInfo"
                class="q-mb-md bg-primary-light q-pa-md rounded-borders bordered text-container"
            >
                <div class="text-h6 q-mb-sm">Info zur App</div>
                <div>
                    <p>
                        Diese Anwendung soll Dir helfen, die Wirtschaftlichkeit deiner
                        Ferienhausvermietung im Oasis zu kalkulieren. Anfallende Kosten bei einer
                        Vermietung über das Oasis werden berücksichtigt. Du kannst sie im Bereich
                        "Kosten" anpassen.
                    </p>

                    <p>
                        Wenn Du "Exakte Monatsberechnung" aktivierst, werden die Kosten tagesgenau
                        kalkuliert. Ansonsten wird für jeden angefangenen Monat der volle Monat
                        berechnet.
                    </p>

                    <p>
                        Dieses Tool erhebt keinen Anspruch auf Vollständigkeit oder Richtigkeit. Es
                        soll als Einschätzung der zu erwartenden Einnahmen und Kosten dienen. Die
                        realen Werte können abweichen.
                    </p>

                    <p>
                        Die Daten werden nur lokal auf Deinem Rechner gespeichert, wenn Du die
                        Speicherfunktion nutzt. Viel Erfolg beim Rechnen!
                    </p>
                </div>
                <div class="text-right">
                    <q-btn color="primary" @click="showInfo = false">{{ $t('ok') }}</q-btn>
                </div>
            </div>
        </q-slide-transition>

        <q-form>
            <div class="row q-col-gutter-md">
                <RentCalculatorMainSeason />
                <RentCalculatorOffSeason />

                <div class="row items-center">
                    <div>{{ $t('rentCalculator.houses') }}</div>
                    <q-input
                        type="number"
                        v-model.number="store.houseCount"
                        filled
                        dense
                        :min="0"
                        class="bg-primary q-ml-sm q-mr-xl rounded-borders"
                        input-class="text-white"
                        style="font-size: 150%; width: 100px"
                        @update:model-value="store.selectedEntry = null"
                    />

                    <RentCalculatorCosts />
                </div>
            </div>
        </q-form>

        <q-separator class="q-mt-md" />

        <div class="text-right">
            <q-toggle
                v-model="store.useExactMonths"
                :label="$t('rentCalculator.exactMonthCalc')"
                size="sm"
            />
        </div>

        <RentCalculatorSaveDialog
            v-model="showSaveDialog"
            :save-name="store.saveName"
            :disable-save="!store.saveName"
            @update:saveName="(val) => (store.saveName = val)"
            @save="store.saveEntry"
            @cancel="showSaveDialog = false"
        />
        <RentCalculatorCostDetailsDialog
            v-model="showMainCostDetails"
            :title="$t('rentCalculator.mainCostDetails')"
            :items="store.mainCostDetailsItems"
        />
        <RentCalculatorCostDetailsDialog
            v-model="showOffCostDetails"
            :title="$t('rentCalculator.offCostDetails')"
            :items="store.offCostDetailsItems"
        />
        <RentCalculatorCostDetailsDialog
            v-model="showTotalCostDetails"
            :title="$t('rentCalculator.totalCostDetails')"
            :items="store.totalCostDetailsItems"
        />
        <RentCalculatorResult
            :main-revenue-full="store.mainRevenueFull"
            :main-occupancy="store.mainOccupancy"
            :main-revenue="store.mainRevenue"
            :main-costs="store.mainCosts"
            :main-profit="store.mainProfit"
            :main-rule-licence-fee="store.mainRuleLicenceFee"
            :main-rule-income="store.mainRuleIncome"
            :main-rule-tax="store.mainRuleTax"
            :main-rule-netto="store.mainRuleNetto"
            :licence-fee="store.licenceFee"
            :off-revenue-full="store.offRevenueFull"
            :off-occupancy="store.offOccupancy"
            :off-revenue="store.offRevenue"
            :off-costs="store.offCosts"
            :off-profit="store.offProfit"
            :off-rule-licence-fee="store.offRuleLicenceFee"
            :off-rule-income="store.offRuleIncome"
            :off-rule-tax="store.offRuleTax"
            :off-rule-netto="store.offRuleNetto"
            :total-revenue="store.totalRevenue"
            :total-costs="store.totalCosts"
            :total-profit="store.totalProfit"
            :total-rule-licence-fee="store.totalRuleLicenceFee"
            :total-rule-income="store.totalRuleIncome"
            :total-rule-tax="store.totalRuleTax"
            :total-rule-netto="store.totalRuleNetto"
            @show-main-cost-details="showMainCostDetails = true"
            @show-off-cost-details="showOffCostDetails = true"
            @show-total-cost-details="showTotalCostDetails = true"
        />
    </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRentCalculatorStore } from 'src/stores/rentCalculatorStore'
import RentCalculatorMainSeason from 'src/components/rent-calculator/RentCalculatorMainSeason.vue'
import RentCalculatorOffSeason from 'src/components/rent-calculator/RentCalculatorOffSeason.vue'
import RentCalculatorResult from 'src/components/rent-calculator/RentCalculatorResult.vue'
import RentCalculatorSaveDialog from 'src/components/rent-calculator/RentCalculatorSaveDialog.vue'
import RentCalculatorCostDetailsDialog from 'src/components/rent-calculator/RentCalculatorCostDetailsDialog.vue'
import RentCalculatorCosts from 'src/components/rent-calculator/RentCalculatorCosts.vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const $q = useQuasar()
const store = useRentCalculatorStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const showSaveDialog = ref(false)
const showMainCostDetails = ref(false)
const showOffCostDetails = ref(false)
const showTotalCostDetails = ref(false)
const showInfo = ref(false)

function shareCalculation() {
    const params = new URLSearchParams()
    const state = store.getCurrentState()
    Object.entries(state).forEach(([key, value]) => {
        params.set(key, value)
    })
    const path = router.currentRoute.value.fullPath.split('?')[0]
    const url = `${window.location.origin}/#${path}?${params.toString()}`
    navigator.clipboard.writeText(url)
    $q.notify({ message: t('rentCalculator.linkCopied') })
}

function resetCalculator() {
    store.resetCosts()

    // Query-Parameter aus der URL entfernen
    router.replace({ query: {} })
}

onMounted(() => {
    store.loadEntries()
    // Werte aus Query übernehmen, falls vorhanden
    const params = route.query
    updateStateFromQuery(params)
})

watch(
    () => route.query,
    (params) => {
        updateStateFromQuery(params)
    },
    { deep: true },
)

function updateStateFromQuery(params) {
    if (Object.keys(params).length > 0) {
        const state = {}
        Object.entries(params).forEach(([key, value]) => {
            const v = Array.isArray(value) ? value[0] : value
            const num = Number(v)
            state[key] = isNaN(num) ? v : num
        })
        store.setState(state)
    }
}
</script>
