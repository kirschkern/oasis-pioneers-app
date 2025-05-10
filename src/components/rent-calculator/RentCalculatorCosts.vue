<template>
    <q-list>
        <q-expansion-item
            :label="$t('rentCalculator.costs')"
            expand-separator
            dense
            header-class="bg-primary text-white rounded-borders rent-calculator-costs-header"
            header-style="height: 40px"
            class="col-12 col-md-6"
            expand-icon-class="text-white"
        >
            <div class="q-px-lg bordered">
                <div class="row items-center q-mt-md">
                    <div class="text-h6">{{ $t('rentCalculator.general') }}</div>
                    <q-space />
                    <q-btn
                        color="primary"
                        size="sm"
                        flat
                        icon="replay"
                        :title="$t('rentCalculator.standard')"
                        @click.stop="store.resetCosts"
                    />
                </div>
                <div class="caption">
                    {{ $t('rentCalculator.cleaningCost') }} {{ store.cleaningCost }}€
                </div>
                <q-slider
                    v-model.number="store.cleaningCost"
                    :min="0"
                    :max="100"
                    :step="5"
                    dense
                    @update:model-value="deselect"
                    label
                />
                <div class="caption">{{ $t('rentCalculator.gasCost') }} {{ store.gasCost }}€</div>
                <q-slider
                    v-model.number="store.gasCost"
                    :min="0"
                    :max="500"
                    :step="5"
                    dense
                    @update:model-value="deselect"
                    label
                />
                <div class="caption">
                    {{ $t('rentCalculator.powerCost') }} {{ store.powerCost }}€
                </div>
                <q-slider
                    v-model.number="store.powerCost"
                    :min="0"
                    :max="200"
                    :step="5"
                    dense
                    @update:model-value="deselect"
                    label
                />
                <div class="caption">
                    {{ $t('rentCalculator.softwareCost') }} {{ store.softwareCost }}€
                </div>
                <q-slider
                    v-model.number="store.softwareCost"
                    :min="0"
                    :max="100"
                    :step="5"
                    dense
                    @update:model-value="deselect"
                    label
                />
                <div class="caption">
                    {{ $t('rentCalculator.repairCost') }} {{ store.repairCost }}€
                </div>
                <q-slider
                    v-model.number="store.repairCost"
                    :min="0"
                    :max="200"
                    :step="5"
                    dense
                    @update:model-value="deselect"
                    label
                />
                <div class="caption">
                    {{ $t('rentCalculator.licenseFee') }}: {{ store.licenceFee }}%
                </div>
                <q-slider
                    v-model.number="store.licenceFee"
                    :min="0"
                    :max="50"
                    :step="1"
                    dense
                    @update:model-value="deselect"
                    label
                />
                <div class="caption">{{ $t('rentCalculator.tax') }} {{ store.tax }}%</div>
                <q-slider
                    v-model.number="store.tax"
                    :min="0"
                    :max="30"
                    :step="1"
                    dense
                    @update:model-value="deselect"
                    label
                />
                <div class="caption q-mt-sm">
                    {{ $t('rentCalculator.ownerTaxRate') }} {{ store.ownerTaxRate }}%
                </div>
                <q-slider
                    v-model.number="store.ownerTaxRate"
                    :min="0"
                    :max="50"
                    :step="1"
                    dense
                    @update:model-value="deselect"
                    label
                />
            </div>
        </q-expansion-item>
    </q-list>
</template>

<script setup>
import { useRentCalculatorStore } from 'src/stores/rentCalculatorStore'
const store = useRentCalculatorStore()

const deselect = () => {
    store.selectedEntry = null
}
</script>

<style lang="scss">
.q-expansion-item--expanded {
    .rent-calculator-costs-header {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
}
</style>
