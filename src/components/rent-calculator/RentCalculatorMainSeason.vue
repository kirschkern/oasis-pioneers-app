<template>
    <div class="col-12 col-md-6 q-col-gutter-xs">
        <div class="text-h6">{{ $t('rentCalculator.mainSeason') }}</div>
        <div class="caption">{{ $t('rentCalculator.mainDays') }} {{ store.mainDays }}</div>
        <q-slider
            v-model.number="store.mainDays"
            :min="0"
            :max="365"
            :step="5"
            dense
            @update:model-value="deselect"
            label
        />
        <div class="caption">
            {{ $t('rentCalculator.mainOccupancy') }} {{ store.mainOccupancy }}%
        </div>
        <q-slider
            v-model.number="store.mainOccupancy"
            :min="0"
            :max="100"
            :step="5"
            dense
            @update:model-value="deselect"
            label
        />
        <div class="row items-center q-col-gutter-sm">
            <div class="q-mb-sm">{{ $t('rentCalculator.mainCalcType') }}</div>
            <q-option-group
                v-model="store.mainCalcType"
                :options="[
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
        </div>
        <div v-if="store.mainCalcType === 'bed'">
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
        <div v-else-if="store.mainCalcType === 'room'">
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
        <div v-else>
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
        <div class="caption">
            {{ $t('rentCalculator.mainCleanings') }} {{ store.mainCleanings }}
        </div>
        <q-slider
            v-model.number="store.mainCleanings"
            :min="0"
            :max="100"
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
