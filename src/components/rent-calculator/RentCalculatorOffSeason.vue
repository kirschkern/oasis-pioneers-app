<template>
    <div class="col-12 col-md-6 q-col-gutter-xs">
        <div class="text-h6">{{ $t('rentCalculator.offSeason') }}</div>
        <div class="caption">{{ $t('rentCalculator.offDays') }} {{ store.offDays }}</div>
        <q-slider
            v-model.number="store.offDays"
            :min="0"
            :max="365"
            :step="5"
            dense
            @update:model-value="deselect"
            label
        />
        <div class="caption">{{ $t('rentCalculator.offOccupancy') }} {{ store.offOccupancy }}%</div>
        <q-slider
            v-model.number="store.offOccupancy"
            :min="0"
            :max="100"
            :step="5"
            dense
            @update:model-value="deselect"
            label
        />
        <div class="q-mb-sm">{{ $t('rentCalculator.mainCalcType') }}</div>
        <q-option-group
            v-model="store.offCalcType"
            :options="[
                { label: $t('rentCalculator.monthlyPrice'), value: 'month' },
                { label: $t('rentCalculator.perBed'), value: 'bed' },
                { label: $t('rentCalculator.perRoom'), value: 'room' },
                { label: $t('rentCalculator.perHouse'), value: 'house' },
            ]"
            type="radio"
            dense
            inline
            class="q-mb-sm"
            @update:model-value="deselect"
        />
        <div v-if="store.offCalcType === 'bed'">
            <div class="caption">{{ $t('rentCalculator.beds') }} {{ store.beds }}</div>
            <q-slider
                v-model.number="store.beds"
                :min="1"
                :max="10"
                :step="1"
                dense
                @update:model-value="deselect"
                label
            />
            <div class="caption">{{ $t('rentCalculator.bedPrice') }} {{ store.bedPrice }}€</div>
            <q-slider
                v-model.number="store.bedPrice"
                :min="0"
                :max="200"
                :step="5"
                dense
                @update:model-value="deselect"
                label
            />
        </div>
        <div v-else-if="store.offCalcType === 'room'">
            <div class="caption">{{ $t('rentCalculator.rooms') }} {{ store.mainRooms }}</div>
            <q-slider
                v-model.number="store.mainRooms"
                :min="1"
                :max="10"
                :step="1"
                dense
                @update:model-value="deselect"
                label
            />
            <div class="caption">{{ $t('rentCalculator.roomPrice') }} {{ store.roomPrice }}€</div>
            <q-slider
                v-model.number="store.roomPrice"
                :min="0"
                :max="200"
                :step="5"
                dense
                @update:model-value="deselect"
                label
            />
        </div>
        <div v-else-if="store.offCalcType === 'house'">
            <div class="caption">{{ $t('rentCalculator.housePrice') }} {{ store.housePrice }}€</div>
            <q-slider
                v-model.number="store.housePrice"
                :min="0"
                :max="500"
                :step="5"
                dense
                @update:model-value="deselect"
                label
            />
        </div>
        <div v-else>
            <div class="caption">
                {{ $t('rentCalculator.monthlyPrice') }} {{ store.monthlyPrice }}€
            </div>
            <q-slider
                v-model.number="store.monthlyPrice"
                :min="0"
                :max="2000"
                :step="5"
                dense
                @update:model-value="deselect"
                label
            />
        </div>
        <div class="caption">{{ $t('rentCalculator.offCleanings') }} {{ store.offCleanings }}</div>
        <q-slider
            v-model.number="store.offCleanings"
            :min="0"
            :max="50"
            :step="5"
            dense
            @update:model-value="deselect"
            label
        />
    </div>
</template>

<script setup>
import { useRentCalculatorStore } from 'src/stores/rentCalculatorStore'
const store = useRentCalculatorStore()
const deselect = () => {
    store.selectedEntry = null
}
</script>
