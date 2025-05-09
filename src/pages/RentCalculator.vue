<template>
    <q-page class="q-pa-md">
        <div class="row q-mb-md items-center">
            <div class="text-h4 q-mb-md">{{ $t('rentCalculator.title') }}</div>
            <q-space />
            <div class="row q-mb-md items-center">
                <q-select
                    v-if="savedEntries.length > 0"
                    v-model="selectedEntry"
                    :options="savedEntries"
                    option-label="name"
                    option-value="name"
                    :label="$t('rentCalculator.savedCalculations')"
                    dense
                    style="width: 250px"
                    class="q-mr-md"
                    @update:model-value="loadEntry"
                />
                <q-btn
                    v-if="selectedEntry"
                    color="primary"
                    icon="delete"
                    flat
                    @click="deleteEntry(selectedEntry)"
                />
                <q-btn
                    color="primary"
                    :label="$t('rentCalculator.save')"
                    @click="showSaveDialog = true"
                    class="q-mr-md"
                />
            </div>
        </div>

        <div class="row q-col-gutter-md no-wrap items-center">
            <div Xclass="">{{ $t('rentCalculator.houses') }}</div>
            <q-input
                type="number"
                v-model.number="houseCount"
                filled
                :min="0"
                style="font-size: 150%"
            />
        </div>

        <q-form>
            <div class="row q-col-gutter-md">
                <!-- HAUPTSAISON -->
                <div class="col-12 col-md-6 q-col-gutter-xs">
                    <div class="text-h6">{{ $t('rentCalculator.mainSeason') }}</div>
                    <div class="caption">{{ $t('rentCalculator.mainDays') }} {{ mainDays }}</div>
                    <q-slider v-model.number="mainDays" :min="0" :max="365" :step="5" dense />
                    <div class="caption">
                        {{ $t('rentCalculator.mainOccupancy') }} {{ mainOccupancy }}%
                    </div>
                    <q-slider
                        v-model.number="mainOccupancy"
                        :min="0"
                        :max="100"
                        :step="5"
                        :label="$t('rentCalculator.mainOccupancy')"
                        dense
                    />

                    <div class="row items-center q-col-gutter-sm">
                        <div class="q-mb-sm">{{ $t('rentCalculator.mainCalcType') }}</div>

                        <q-option-group
                            v-model="mainCalcType"
                            :options="[
                                { label: $t('rentCalculator.perBed'), value: 'bed' },
                                { label: $t('rentCalculator.perRoom'), value: 'room' },
                                { label: $t('rentCalculator.perHouse'), value: 'house' },
                            ]"
                            type="radio"
                            dense
                            inline
                            class="q-mb-sm"
                        />
                    </div>

                    <div v-if="mainCalcType === 'bed'">
                        <div class="caption">{{ $t('rentCalculator.beds') }} {{ beds }}</div>
                        <q-slider v-model.number="beds" :min="1" :max="10" :step="1" dense />
                        <div class="caption">
                            {{ $t('rentCalculator.bedPrice') }} {{ bedPrice }}€
                        </div>
                        <q-slider v-model.number="bedPrice" :min="0" :max="200" :step="5" dense />
                    </div>
                    <div v-else-if="mainCalcType === 'room'">
                        <div class="caption">{{ $t('rentCalculator.rooms') }} {{ mainRooms }}</div>
                        <q-slider v-model.number="mainRooms" :min="1" :max="10" :step="1" dense />
                        <div class="caption">
                            {{ $t('rentCalculator.roomPrice') }} {{ roomPrice }}€
                        </div>
                        <q-slider v-model.number="roomPrice" :min="0" :max="200" :step="5" dense />
                    </div>
                    <div v-else>
                        <div class="caption">
                            {{ $t('rentCalculator.housePrice') }} {{ housePrice }}€
                        </div>
                        <q-slider v-model.number="housePrice" :min="0" :max="500" :step="5" dense />
                    </div>
                    <div class="caption">
                        {{ $t('rentCalculator.mainCleanings') }} {{ mainCleanings }}
                    </div>
                    <q-slider v-model.number="mainCleanings" :min="0" :max="100" :step="5" dense />
                </div>

                <!-- NEBENSAISON -->
                <div class="col-12 col-md-6 q-col-gutter-xs">
                    <div class="text-h6">{{ $t('rentCalculator.offSeason') }}</div>
                    <div class="caption">{{ $t('rentCalculator.offDays') }} {{ offDays }}</div>
                    <q-slider v-model.number="offDays" :min="0" :max="365" :step="5" dense />
                    <div class="caption">
                        {{ $t('rentCalculator.offOccupancy') }} {{ offOccupancy }}%
                    </div>
                    <q-slider
                        v-model.number="offOccupancy"
                        :min="0"
                        :max="100"
                        :step="5"
                        :label="$t('rentCalculator.offOccupancy')"
                        dense
                    />

                    <div class="q-mb-sm">{{ $t('rentCalculator.mainCalcType') }}</div>
                    <q-option-group
                        v-model="offCalcType"
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
                    />
                    <div v-if="offCalcType === 'bed'">
                        <div class="caption">{{ $t('rentCalculator.beds') }} {{ beds }}</div>
                        <q-slider v-model.number="beds" :min="1" :max="10" :step="1" dense />
                        <div class="caption">
                            {{ $t('rentCalculator.bedPrice') }} {{ bedPrice }}€
                        </div>
                        <q-slider v-model.number="bedPrice" :min="0" :max="200" :step="5" dense />
                    </div>
                    <div v-else-if="offCalcType === 'room'">
                        <div class="caption">{{ $t('rentCalculator.rooms') }} {{ mainRooms }}</div>
                        <q-slider v-model.number="mainRooms" :min="1" :max="10" :step="1" dense />
                        <div class="caption">
                            {{ $t('rentCalculator.roomPrice') }} {{ roomPrice }}€
                        </div>
                        <q-slider v-model.number="roomPrice" :min="0" :max="200" :step="5" dense />
                    </div>
                    <div v-else-if="offCalcType === 'house'">
                        <div class="caption">
                            {{ $t('rentCalculator.housePrice') }} {{ housePrice }}€
                        </div>
                        <q-slider v-model.number="housePrice" :min="0" :max="500" :step="5" dense />
                    </div>
                    <div v-else>
                        <div class="caption">
                            {{ $t('rentCalculator.monthlyPrice') }} {{ monthlyPrice }}€
                        </div>
                        <q-slider
                            v-model.number="monthlyPrice"
                            :min="0"
                            :max="2000"
                            :step="5"
                            dense
                        />
                    </div>
                    <div class="caption">
                        {{ $t('rentCalculator.offCleanings') }} {{ offCleanings }}
                    </div>
                    <q-slider v-model.number="offCleanings" :min="0" :max="50" :step="5" dense />
                </div>
            </div>
            <q-list bordered class="rounded-borders q-mt-md">
                <q-expansion-item
                    :label="$t('rentCalculator.costs')"
                    expand-separator
                    Xcontent-inset-level="1"
                    header-class="bg-primary text-white"
                >
                    <div class="row q-px-lg">
                        <div class="col-12 col-md-6">
                            <div class="row items-center q-mt-md">
                                <div class="text-h6">{{ $t('rentCalculator.general') }}</div>
                                <q-space />
                                <q-btn
                                    color="primary"
                                    size="sm"
                                    flat
                                    icon="refresh"
                                    :label="$t('rentCalculator.standard')"
                                    @click.stop="resetCosts"
                                />
                            </div>
                            <div class="caption">
                                {{ $t('rentCalculator.cleaningCost') }} {{ cleaningCost }}€
                            </div>
                            <q-slider
                                v-model.number="cleaningCost"
                                :min="0"
                                :max="100"
                                :step="5"
                                dense
                            />
                            <div class="caption">
                                {{ $t('rentCalculator.gasCost') }} {{ gasCost }}€
                            </div>
                            <q-slider
                                v-model.number="gasCost"
                                :min="0"
                                :max="500"
                                :step="5"
                                dense
                            />
                            <div class="caption">
                                {{ $t('rentCalculator.powerCost') }} {{ powerCost }}€
                            </div>
                            <q-slider
                                v-model.number="powerCost"
                                :min="0"
                                :max="200"
                                :step="5"
                                dense
                            />
                            <div class="caption">
                                {{ $t('rentCalculator.softwareCost') }} {{ softwareCost }}€
                            </div>
                            <q-slider
                                v-model.number="softwareCost"
                                :min="0"
                                :max="100"
                                :step="5"
                                dense
                            />
                            <div class="caption">
                                {{ $t('rentCalculator.repairCost') }} {{ repairCost }}€
                            </div>
                            <q-slider
                                v-model.number="repairCost"
                                :min="0"
                                :max="200"
                                :step="5"
                                dense
                            />
                            <div class="caption">
                                {{ $t('rentCalculator.licenseFee') }}: {{ abgabe }}%
                            </div>
                            <q-slider v-model.number="abgabe" :min="0" :max="50" :step="1" dense />

                            <div class="caption">{{ $t('rentCalculator.tax') }} {{ tax }}%</div>
                            <q-slider v-model.number="tax" :min="0" :max="30" :step="1" dense />
                        </div>
                    </div>
                </q-expansion-item>
            </q-list>
        </q-form>

        <q-separator class="q-my-lg" />

        <div class="text-right">
            <q-toggle
                v-model="useExactMonths"
                :label="$t('rentCalculator.exactMonthCalc')"
                size="sm"
            />
        </div>

        <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
                <div class="text-h6">{{ $t('rentCalculator.mainResult') }}</div>
                <div>
                    {{ $t('rentCalculator.revenueFull') }}:
                    <b>{{
                        mainRevenueFull.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                    }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.revenue', { occupancy: mainOccupancy }) }}:
                    <b>{{
                        mainRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                    }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.costs') }}:
                    <b>{{
                        mainCosts.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                    }}</b>
                    <q-btn
                        size="sm"
                        flat
                        color="primary"
                        :label="$t('rentCalculator.details')"
                        @click="showMainCostDetails = true"
                    />
                </div>
                <div>
                    {{ $t('rentCalculator.profit') }}:
                    <b>{{
                        mainProfit.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                    }}</b>
                </div>
                <div class="q-mt-sm text-bold">{{ $t('rentCalculator.share') }}</div>
                <div>
                    {{ $t('rentCalculator.shareAmount', { abgabe: abgabe }) }}
                    <b>{{
                        mainRuleAbgabe.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                    }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.incomeAmount', { income: 100 - abgabe }) }}
                    <b>{{
                        mainRuleEinnahme.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                    }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.tax28') }}
                    <b>{{
                        mainRuleSteuer.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                    }}</b>
                </div>
                <div class="text-primary">
                    {{ $t('rentCalculator.afterTax') }}
                    <b>{{
                        mainRuleNetto.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                    }}</b>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="text-h6">{{ $t('rentCalculator.offResult') }}</div>
                <div>
                    {{ $t('rentCalculator.revenueFull') }}:
                    <b>{{
                        offRevenueFull.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                    }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.revenue', { occupancy: offOccupancy }) }}:
                    <b>{{
                        offRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                    }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.costs') }}:
                    <b>{{
                        offCosts.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                    }}</b>
                    <q-btn
                        size="sm"
                        flat
                        color="primary"
                        :label="$t('rentCalculator.details')"
                        @click="showOffCostDetails = true"
                    />
                </div>
                <div>
                    {{ $t('rentCalculator.profit') }}:
                    <b>{{
                        offProfit.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                    }}</b>
                </div>
                <div class="q-mt-sm text-bold">{{ $t('rentCalculator.share') }}</div>
                <div>
                    {{ $t('rentCalculator.shareAmount', { abgabe: abgabe }) }}
                    <b>{{
                        offRuleAbgabe.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                    }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.incomeAmount', { income: 100 - abgabe }) }}
                    <b>{{
                        offRuleEinnahme.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                    }}</b>
                </div>
                <div>
                    {{ $t('rentCalculator.tax28') }}
                    <b>{{
                        offRuleSteuer.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })
                    }}</b>
                </div>
                <div class="text-primary">
                    {{ $t('rentCalculator.afterTax') }}
                    <b>{{
                        offRuleNetto.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                    }}</b>
                </div>
            </div>
        </div>
        <q-separator class="q-my-lg" />
        <div class="text-h5">{{ $t('rentCalculator.total') }}</div>
        <div>
            {{ $t('rentCalculator.totalRevenue') }}:
            <b>{{
                totalRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
            }}</b>
        </div>
        <div>
            {{ $t('rentCalculator.totalCosts') }}:
            <b>{{ totalCosts.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }}</b>
            <q-btn
                size="sm"
                flat
                color="primary"
                :label="$t('rentCalculator.details')"
                @click="showTotalCostDetails = true"
            />
        </div>
        <div>
            {{ $t('rentCalculator.totalProfit') }}:
            <b>{{ totalProfit.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }}</b>
        </div>
        <div class="q-mt-sm text-bold">{{ $t('rentCalculator.share') }}</div>
        <div>
            {{ $t('rentCalculator.shareAmount', { abgabe: abgabe }) }}
            <b>{{
                totalRuleAbgabe.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
            }}</b>
        </div>
        <div>
            {{ $t('rentCalculator.incomeAmount', { income: 100 - abgabe }) }}
            <b>{{
                totalRuleEinnahme.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
            }}</b>
        </div>
        <div>
            {{ $t('rentCalculator.tax28') }}
            <b>{{
                totalRuleSteuer.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
            }}</b>
        </div>
        <div class="text-primary">
            {{ $t('rentCalculator.afterTax') }}
            <b>{{
                totalRuleNetto.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
            }}</b>
        </div>
        <q-dialog v-model="showSaveDialog">
            <q-card>
                <q-card-section>
                    <div class="text-h6">{{ $t('rentCalculator.saveCalculation') }}</div>
                    <q-input
                        v-model="saveName"
                        :label="$t('rentCalculator.name')"
                        autofocus
                        @keyup.enter="saveEntry"
                    />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat :label="$t('rentCalculator.cancel')" v-close-popup />
                    <q-btn
                        color="primary"
                        :label="$t('rentCalculator.save')"
                        @click="saveEntry"
                        :disable="!saveName"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="showMainCostDetails">
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">{{ $t('rentCalculator.mainCostDetails') }}</div>
                    <q-list dense>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.cleaningCost') }}</q-item-section>
                            <q-item-section side
                                >{{ mainCleanings }} × {{ cleaningCost }} € =
                                {{
                                    (mainCleanings * cleaningCost).toLocaleString('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    })
                                }}</q-item-section
                            >
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.power') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths"
                                    >{{ mainDays }} / 30 × {{ powerCost }} € =
                                    {{
                                        ((mainDays / 30) * powerCost).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}</span
                                >
                                <span v-else
                                    >{{ Math.ceil(mainDays / 30) }} × {{ powerCost }} € =
                                    {{
                                        (Math.ceil(mainDays / 30) * powerCost).toLocaleString(
                                            'de-DE',
                                            { style: 'currency', currency: 'EUR' },
                                        )
                                    }}</span
                                >
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.gas') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ mainMonthFactor.toFixed(2) }} × {{ gasCost }} € =
                                    {{
                                        (mainMonthFactor * gasCost).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil(mainDays / 30) }} × {{ gasCost }} € =
                                    {{
                                        (Math.ceil(mainDays / 30) * gasCost).toLocaleString(
                                            'de-DE',
                                            { style: 'currency', currency: 'EUR' },
                                        )
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.software') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ mainMonthFactor.toFixed(2) }} × {{ softwareCost }} € =
                                    {{
                                        (mainMonthFactor * softwareCost).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil(mainDays / 30) }} × {{ softwareCost }} € =
                                    {{
                                        (Math.ceil(mainDays / 30) * softwareCost).toLocaleString(
                                            'de-DE',
                                            { style: 'currency', currency: 'EUR' },
                                        )
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.repair') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ mainMonthFactor.toFixed(2) }} × {{ repairCost }} € =
                                    {{
                                        (mainMonthFactor * repairCost).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil(mainDays / 30) }} × {{ repairCost }} € =
                                    {{
                                        (Math.ceil(mainDays / 30) * repairCost).toLocaleString(
                                            'de-DE',
                                            { style: 'currency', currency: 'EUR' },
                                        )
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{
                                $t('rentCalculator.taxDetail', {
                                    tax: tax,
                                })
                            }}</q-item-section>
                            <q-item-section side>
                                {{
                                    (mainRevenue * (tax / 100)).toLocaleString('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    })
                                }}
                            </q-item-section>
                        </q-item>
                        <div class="text-right">
                            <q-btn
                                flat
                                color="primary"
                                :label="$t('rentCalculator.close')"
                                v-close-popup
                            />
                        </div>
                    </q-list>
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="showOffCostDetails">
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">{{ $t('rentCalculator.offCostDetails') }}</div>
                    <q-list dense>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.cleaningCost') }}</q-item-section>
                            <q-item-section side
                                >{{ offCleanings }} × {{ cleaningCost }} € =
                                {{
                                    (offCleanings * cleaningCost).toLocaleString('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    })
                                }}</q-item-section
                            >
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.power') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ offDays }} / 30 × {{ powerCost }} € =
                                    {{
                                        ((offDays / 30) * powerCost).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil(offDays / 30) }} × {{ powerCost }} € =
                                    {{
                                        (Math.ceil(offDays / 30) * powerCost).toLocaleString(
                                            'de-DE',
                                            { style: 'currency', currency: 'EUR' },
                                        )
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.gas') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ offDays }} / 30 × {{ gasCost }} € =
                                    {{
                                        ((offDays / 30) * gasCost).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil(offDays / 30) }} × {{ gasCost }} € =
                                    {{
                                        (Math.ceil(offDays / 30) * gasCost).toLocaleString(
                                            'de-DE',
                                            { style: 'currency', currency: 'EUR' },
                                        )
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.software') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ offDays }} / 30 × {{ softwareCost }} € =
                                    {{
                                        ((offDays / 30) * softwareCost).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil(offDays / 30) }} × {{ softwareCost }} € =
                                    {{
                                        (Math.ceil(offDays / 30) * softwareCost).toLocaleString(
                                            'de-DE',
                                            { style: 'currency', currency: 'EUR' },
                                        )
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.repair') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ offDays }} / 30 × {{ repairCost }} € =
                                    {{
                                        ((offDays / 30) * repairCost).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil(offDays / 30) }} × {{ repairCost }} € =
                                    {{
                                        (Math.ceil(offDays / 30) * repairCost).toLocaleString(
                                            'de-DE',
                                            { style: 'currency', currency: 'EUR' },
                                        )
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{
                                $t('rentCalculator.taxDetail', {
                                    tax: tax,
                                })
                            }}</q-item-section>
                            <q-item-section side>
                                {{
                                    (offRevenue * (tax / 100)).toLocaleString('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    })
                                }}
                            </q-item-section>
                        </q-item>
                        <div class="text-right">
                            <q-btn
                                flat
                                color="primary"
                                :label="$t('rentCalculator.close')"
                                v-close-popup
                            />
                        </div>
                    </q-list>
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="showTotalCostDetails">
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">{{ $t('rentCalculator.totalCostDetails') }}</div>
                    <q-list dense>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.cleaningCost') }}</q-item-section>
                            <q-item-section side
                                >{{ mainCleanings + offCleanings }} × {{ cleaningCost }} € =
                                {{
                                    ((mainCleanings + offCleanings) * cleaningCost).toLocaleString(
                                        'de-DE',
                                        { style: 'currency', currency: 'EUR' },
                                    )
                                }}</q-item-section
                            >
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.power') }}</q-item-section>
                            <q-item-section side>
                                {{
                                    mainDays +
                                    offDays +
                                    ' / 30 × ' +
                                    powerCost +
                                    ' € = ' +
                                    (((mainDays + offDays) / 30) * powerCost).toLocaleString(
                                        'de-DE',
                                        { style: 'currency', currency: 'EUR' },
                                    )
                                }}
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.gas') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ (mainMonthFactor + offMonthFactor).toFixed(2) }} ×
                                    {{ gasCost }} € =
                                    {{
                                        (
                                            (mainMonthFactor + offMonthFactor) *
                                            gasCost
                                        ).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil((mainDays + offDays) / 30) }} × {{ gasCost }} € =
                                    {{
                                        (
                                            Math.ceil((mainDays + offDays) / 30) * gasCost
                                        ).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.software') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ (mainMonthFactor + offMonthFactor).toFixed(2) }} ×
                                    {{ softwareCost }} € =
                                    {{
                                        (
                                            (mainMonthFactor + offMonthFactor) *
                                            softwareCost
                                        ).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil((mainDays + offDays) / 30) }} ×
                                    {{ softwareCost }} € =
                                    {{
                                        (
                                            Math.ceil((mainDays + offDays) / 30) * softwareCost
                                        ).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{ $t('rentCalculator.repair') }}</q-item-section>
                            <q-item-section side>
                                <span v-if="useExactMonths">
                                    {{ (mainMonthFactor + offMonthFactor).toFixed(2) }} ×
                                    {{ repairCost }} € =
                                    {{
                                        (
                                            (mainMonthFactor + offMonthFactor) *
                                            repairCost
                                        ).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                                <span v-else>
                                    {{ Math.ceil((mainDays + offDays) / 30) }} × {{ repairCost }} €
                                    =
                                    {{
                                        (
                                            Math.ceil((mainDays + offDays) / 30) * repairCost
                                        ).toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })
                                    }}
                                </span>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>{{
                                $t('rentCalculator.taxDetail', {
                                    tax: tax,
                                })
                            }}</q-item-section>
                            <q-item-section side>
                                {{
                                    ((mainRevenue + offRevenue) * (tax / 100)).toLocaleString(
                                        'de-DE',
                                        { style: 'currency', currency: 'EUR' },
                                    )
                                }}
                            </q-item-section>
                        </q-item>
                        <div class="text-right">
                            <q-btn
                                flat
                                color="primary"
                                :label="$t('rentCalculator.close')"
                                v-close-popup
                            />
                        </div>
                    </q-list>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Parameter
const mainDays = ref(150)
const offDays = ref(215)
const mainOccupancy = ref(100)
const offOccupancy = ref(70)
const mainCalcType = ref('bed') // 'bed', 'room', 'house'
const mainRooms = ref(2)
const roomPrice = ref(75)
const houseCount = ref(1)
const bedPrice = ref(45)
const housePrice = ref(120)
const monthlyPrice = ref(750)
const beds = ref(4)
const mainCleanings = ref(50)
const offCleanings = ref(5)
const cleaningCost = ref(35)
const tax = ref(6)
const gasCost = ref(20)
const powerCost = ref(50)
const softwareCost = ref(10)
const repairCost = ref(30)
const offCalcType = ref('month') // 'bed', 'room', 'house', 'month'
const showSaveDialog = ref(false)
const saveName = ref('')
const savedEntries = ref([])
const selectedEntry = ref(null)
const abgabe = ref(30)

// Toggle für Kostenberechnung
const useExactMonths = ref(true)

// Monatsfaktoren dynamisch berechnen
const mainMonthFactor = computed(() =>
    useExactMonths.value ? mainDays.value / 30 : Math.ceil(mainDays.value / 30),
)
const offMonthFactor = computed(() =>
    useExactMonths.value ? offDays.value / 30 : Math.ceil(offDays.value / 30),
)

// Einnahmen Hauptsaison
const mainRevenueFull = computed(() => {
    if (mainCalcType.value === 'bed') {
        return bedPrice.value * beds.value * mainDays.value * houseCount.value
    } else if (mainCalcType.value === 'room') {
        return roomPrice.value * mainRooms.value * mainDays.value * houseCount.value
    } else {
        return housePrice.value * houseCount.value * mainDays.value
    }
})
const mainRevenue = computed(() => mainRevenueFull.value * (mainOccupancy.value / 100))
// Kosten Hauptsaison
const mainCosts = computed(
    () =>
        mainCleanings.value * cleaningCost.value +
        (useExactMonths.value ? mainDays.value / 30 : Math.ceil(mainDays.value / 30)) *
            powerCost.value +
        (useExactMonths.value ? mainDays.value / 30 : Math.ceil(mainDays.value / 30)) *
            gasCost.value +
        (useExactMonths.value ? mainDays.value / 30 : Math.ceil(mainDays.value / 30)) *
            softwareCost.value +
        (useExactMonths.value ? mainDays.value / 30 : Math.ceil(mainDays.value / 30)) *
            repairCost.value +
        mainRevenue.value * (tax.value / 100),
)
const mainSteuer = computed(() => mainRevenue.value * (28 / 100))
const mainProfit = computed(() => mainRevenue.value - mainCosts.value - mainSteuer.value)

// Einnahmen Nebensaison
const offRevenueFull = computed(() => {
    if (offCalcType.value === 'bed') {
        return bedPrice.value * beds.value * offDays.value * houseCount.value
    } else if (offCalcType.value === 'room') {
        return roomPrice.value * mainRooms.value * offDays.value * houseCount.value
    } else if (offCalcType.value === 'house') {
        return housePrice.value * houseCount.value * offDays.value
    } else {
        return monthlyPrice.value * Math.ceil(offDays.value / 30) * houseCount.value
    }
})
const offRevenue = computed(() => offRevenueFull.value * (offOccupancy.value / 100))
// Kosten Nebensaison
const offCosts = computed(
    () =>
        offCleanings.value * cleaningCost.value +
        (useExactMonths.value ? offDays.value / 30 : Math.ceil(offDays.value / 30)) *
            powerCost.value +
        (useExactMonths.value ? offDays.value / 30 : Math.ceil(offDays.value / 30)) *
            gasCost.value +
        (useExactMonths.value ? offDays.value / 30 : Math.ceil(offDays.value / 30)) *
            softwareCost.value +
        (useExactMonths.value ? offDays.value / 30 : Math.ceil(offDays.value / 30)) *
            repairCost.value +
        offRevenue.value * (tax.value / 100),
)
const offSteuer = computed(() => offRevenue.value * (28 / 100))
const offProfit = computed(() => offRevenue.value - offCosts.value - offSteuer.value)

// Gesamtergebnis
const totalRevenue = computed(() => mainRevenue.value + offRevenue.value)
const totalCosts = computed(() => mainCosts.value + offCosts.value)
const totalSteuer = computed(() => totalRevenue.value * (28 / 100))
const totalProfit = computed(() => totalRevenue.value - totalCosts.value - totalSteuer.value)

// 70/30-Regel dynamisch nach Abgabe-Slider
const mainRuleAbgabe = computed(() => mainProfit.value * (abgabe.value / 100))
const mainRuleEinnahme = computed(() => mainProfit.value * (1 - abgabe.value / 100))
const mainRuleSteuer = computed(() => mainRuleEinnahme.value * 0.28)
const mainRuleNetto = computed(() => mainRuleEinnahme.value - mainRuleSteuer.value)

const offRuleAbgabe = computed(() => offProfit.value * (abgabe.value / 100))
const offRuleEinnahme = computed(() => offProfit.value * (1 - abgabe.value / 100))
const offRuleSteuer = computed(() => offRuleEinnahme.value * 0.28)
const offRuleNetto = computed(() => offRuleEinnahme.value - offRuleSteuer.value)

const totalRuleAbgabe = computed(() => totalProfit.value * (abgabe.value / 100))
const totalRuleEinnahme = computed(() => totalProfit.value * (1 - abgabe.value / 100))
const totalRuleSteuer = computed(() => totalRuleEinnahme.value * 0.28)
const totalRuleNetto = computed(() => totalRuleEinnahme.value - totalRuleSteuer.value)

// Synchronisiere die Tage, damit die Summe nie über 365 liegt
watch(mainDays, (val) => {
    if (val + offDays.value > 365) {
        offDays.value = 365 - val
    }
})
watch(offDays, (val) => {
    if (val + mainDays.value > 365) {
        mainDays.value = 365 - val
    }
})

// Script: Drei Dialog-States für Details
const showMainCostDetails = ref(false)
const showOffCostDetails = ref(false)
const showTotalCostDetails = ref(false)

function getCurrentState() {
    return {
        mainDays: mainDays.value,
        offDays: offDays.value,
        mainOccupancy: mainOccupancy.value,
        offOccupancy: offOccupancy.value,
        mainCalcType: mainCalcType.value,
        offCalcType: offCalcType.value,
        mainRooms: mainRooms.value,
        roomPrice: roomPrice.value,
        houseCount: houseCount.value,
        bedPrice: bedPrice.value,
        housePrice: housePrice.value,
        monthlyPrice: monthlyPrice.value,
        beds: beds.value,
        mainCleanings: mainCleanings.value,
        offCleanings: offCleanings.value,
        cleaningCost: cleaningCost.value,
        tax: tax.value,
        gasCost: gasCost.value,
        powerCost: powerCost.value,
        softwareCost: softwareCost.value,
        repairCost: repairCost.value,
        abgabe: abgabe.value,
    }
}

function setState(state) {
    mainDays.value = state.mainDays
    offDays.value = state.offDays
    mainOccupancy.value = state.mainOccupancy
    offOccupancy.value = state.offOccupancy
    mainCalcType.value = state.mainCalcType
    offCalcType.value = state.offCalcType
    mainRooms.value = state.mainRooms
    roomPrice.value = state.roomPrice
    houseCount.value = state.houseCount
    bedPrice.value = state.bedPrice
    housePrice.value = state.housePrice
    monthlyPrice.value = state.monthlyPrice
    beds.value = state.beds
    mainCleanings.value = state.mainCleanings
    offCleanings.value = state.offCleanings
    cleaningCost.value = state.cleaningCost
    tax.value = state.tax
    gasCost.value = state.gasCost
    powerCost.value = state.powerCost
    softwareCost.value = state.softwareCost
    repairCost.value = state.repairCost
    if (typeof state.abgabe === 'number') abgabe.value = state.abgabe
}

function saveEntry() {
    const entry = getCurrentState()
    entry.name = saveName.value
    let entries = JSON.parse(localStorage.getItem('rentCalcEntries') || '[]')
    // Überschreibe, falls Name schon existiert
    entries = entries.filter((e) => e.name !== entry.name)
    entries.push(entry)
    localStorage.setItem('rentCalcEntries', JSON.stringify(entries))
    showSaveDialog.value = false
    saveName.value = ''
    loadEntries()
    selectedEntry.value = entry
}

function loadEntries() {
    savedEntries.value = JSON.parse(localStorage.getItem('rentCalcEntries') || '[]')
}

function loadEntry(entry) {
    if (entry && entry.name) setState(entry)
}

function deleteEntry(entry) {
    const name = entry && entry.name ? entry.name : entry
    let entries = JSON.parse(localStorage.getItem('rentCalcEntries') || '[]')
    entries = entries.filter((e) => e.name !== name)
    localStorage.setItem('rentCalcEntries', JSON.stringify(entries))
    loadEntries()
    selectedEntry.value = null
}

function resetCosts() {
    cleaningCost.value = 35
    tax.value = 6
    gasCost.value = 60
    powerCost.value = 50
    softwareCost.value = 10
    repairCost.value = 30
}

onMounted(loadEntries)
</script>
