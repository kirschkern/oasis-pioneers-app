import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export const useRentCalculatorStore = defineStore('rentCalculator', () => {
    const { t } = useI18n()

    // Parameter
    const mainDays = ref(150)
    const offDays = ref(215)
    const mainOccupancy = ref(100)
    const offOccupancy = ref(70)
    const mainCalcType = ref('bed')
    const mainRooms = ref(2)
    const roomPrice = ref(75)
    const houseCount = ref(1)
    const bedPrice = ref(45)
    const housePrice = ref(120)
    const monthlyPrice = ref(750)
    const beds = ref(3)
    const mainCleanings = ref(50)
    const offCleanings = ref(5)
    const cleaningCost = ref(35)
    const tax = ref(6)
    const gasCost = ref(20)
    const powerCost = ref(50)
    const softwareCost = ref(10)
    const repairCost = ref(30)
    const offCalcType = ref('month')
    const licenceFee = ref(30)
    const ownerTaxRate = ref(25)

    // Toggle für Kostenberechnung
    const useExactMonths = ref(true)

    // Monatsfaktoren
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
            houseCount.value *
                (mainCleanings.value * cleaningCost.value +
                    mainMonthFactor.value * powerCost.value +
                    mainMonthFactor.value * gasCost.value +
                    mainMonthFactor.value * softwareCost.value +
                    mainMonthFactor.value * repairCost.value) +
            mainRevenue.value * (tax.value / 100),
    )

    const mainProfit = computed(() => mainRevenue.value - mainCosts.value)

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
            houseCount.value *
                (offCleanings.value * cleaningCost.value +
                    offMonthFactor.value * powerCost.value +
                    offMonthFactor.value * gasCost.value +
                    offMonthFactor.value * softwareCost.value +
                    offMonthFactor.value * repairCost.value) +
            offRevenue.value * (tax.value / 100),
    )
    const offTax = computed(() => offRevenue.value * (ownerTaxRate.value / 100))
    const offProfit = computed(() => offRevenue.value - offCosts.value)

    // Gesamtergebnis
    const totalRevenue = computed(() => mainRevenue.value + offRevenue.value)
    const totalCosts = computed(() => mainCosts.value + offCosts.value)
    const totalTax = computed(() => totalRevenue.value * (ownerTaxRate.value / 100))
    const totalProfit = computed(() => totalRevenue.value - totalCosts.value)

    // 70/30-Regel
    const mainRuleLicenceFee = computed(() => mainProfit.value * (licenceFee.value / 100))
    const mainRuleIncome = computed(() => mainProfit.value * (1 - licenceFee.value / 100))
    const mainRuleTax = computed(() => mainRuleIncome.value * (ownerTaxRate.value / 100))
    const mainRuleNetto = computed(() => mainRuleIncome.value - mainRuleTax.value)

    const offRuleLicenceFee = computed(() => offProfit.value * (licenceFee.value / 100))
    const offRuleIncome = computed(() => offProfit.value * (1 - licenceFee.value / 100))
    const offRuleTax = computed(() => offRuleIncome.value * (ownerTaxRate.value / 100))
    const offRuleNetto = computed(() => offRuleIncome.value - offRuleTax.value)

    const totalRuleLicenceFee = computed(() => totalProfit.value * (licenceFee.value / 100))
    const totalRuleIncome = computed(() => totalProfit.value * (1 - licenceFee.value / 100))
    const totalRuleTax = computed(() => totalRuleIncome.value * (ownerTaxRate.value / 100))
    const totalRuleNetto = computed(() => totalRuleIncome.value - totalRuleTax.value)

    // Dialog-Items
    const mainCostDetailsItems = computed(() => [
        {
            label: t('rentCalculator.cleaningCost'),
            value: `${houseCount.value} × ${mainCleanings.value} × ${cleaningCost.value} € = ${(houseCount.value * mainCleanings.value * cleaningCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.power'),
            value: useExactMonths.value
                ? `${houseCount.value} × ${mainDays.value} / 30 × ${powerCost.value} € = ${(houseCount.value * (mainDays.value / 30) * powerCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil(mainDays.value / 30)} × ${powerCost.value} € = ${(houseCount.value * Math.ceil(mainDays.value / 30) * powerCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.gas'),
            value: useExactMonths.value
                ? `${houseCount.value} × ${mainMonthFactor.value.toFixed(2)} × ${gasCost.value} € = ${(houseCount.value * mainMonthFactor.value * gasCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil(mainDays.value / 30)} × ${gasCost.value} € = ${(houseCount.value * Math.ceil(mainDays.value / 30) * gasCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.software'),
            value: useExactMonths.value
                ? `${houseCount.value} × ${mainMonthFactor.value.toFixed(2)} × ${softwareCost.value} € = ${(houseCount.value * mainMonthFactor.value * softwareCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil(mainDays.value / 30)} × ${softwareCost.value} € = ${(houseCount.value * Math.ceil(mainDays.value / 30) * softwareCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.repair'),
            value: useExactMonths.value
                ? `${houseCount.value} × ${mainMonthFactor.value.toFixed(2)} × ${repairCost.value} € = ${(houseCount.value * mainMonthFactor.value * repairCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil(mainDays.value / 30)} × ${repairCost.value} € = ${(houseCount.value * Math.ceil(mainDays.value / 30) * repairCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
    ])

    const offCostDetailsItems = computed(() => [
        {
            label: t('rentCalculator.cleaningCost'),
            value: `${houseCount.value} × ${offCleanings.value} × ${cleaningCost.value} € = ${(houseCount.value * offCleanings.value * cleaningCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.power'),
            value: useExactMonths.value
                ? `${houseCount.value} × ${offDays.value} / 30 × ${powerCost.value} € = ${(houseCount.value * (offDays.value / 30) * powerCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil(offDays.value / 30)} × ${powerCost.value} € = ${(houseCount.value * Math.ceil(offDays.value / 30) * powerCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.gas'),
            value: useExactMonths.value
                ? `${houseCount.value} × ${offDays.value} / 30 × ${gasCost.value} € = ${(houseCount.value * (offDays.value / 30) * gasCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil(offDays.value / 30)} × ${gasCost.value} € = ${(houseCount.value * Math.ceil(offDays.value / 30) * gasCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.software'),
            value: useExactMonths.value
                ? `${houseCount.value} × ${offDays.value} / 30 × ${softwareCost.value} € = ${(houseCount.value * (offDays.value / 30) * softwareCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil(offDays.value / 30)} × ${softwareCost.value} € = ${(houseCount.value * Math.ceil(offDays.value / 30) * softwareCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.repair'),
            value: useExactMonths.value
                ? `${houseCount.value} × ${offDays.value} / 30 × ${repairCost.value} € = ${(houseCount.value * (offDays.value / 30) * repairCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil(offDays.value / 30)} × ${repairCost.value} € = ${(houseCount.value * Math.ceil(offDays.value / 30) * repairCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
    ])

    const totalCostDetailsItems = computed(() => [
        {
            label: t('rentCalculator.cleaningCost'),
            value: `${houseCount.value} × (${mainCleanings.value} + ${offCleanings.value}) × ${cleaningCost.value} € = ${(houseCount.value * (mainCleanings.value + offCleanings.value) * cleaningCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.power'),
            value: `${houseCount.value} × (${mainDays.value} + ${offDays.value}) / 30 × ${powerCost.value} € = ${(houseCount.value * ((mainDays.value + offDays.value) / 30) * powerCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.gas'),
            value: useExactMonths.value
                ? `${houseCount.value} × (${mainMonthFactor.value} + ${offMonthFactor.value}) × ${gasCost.value} € = ${(houseCount.value * (mainMonthFactor.value + offMonthFactor.value) * gasCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil((mainDays.value + offDays.value) / 30)} × ${gasCost.value} € = ${(houseCount.value * Math.ceil((mainDays.value + offDays.value) / 30) * gasCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.software'),
            value: useExactMonths.value
                ? `${houseCount.value} × (${mainMonthFactor.value} + ${offMonthFactor.value}) × ${softwareCost.value} € = ${(houseCount.value * (mainMonthFactor.value + offMonthFactor.value) * softwareCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil((mainDays.value + offDays.value) / 30)} × ${softwareCost.value} € = ${(houseCount.value * Math.ceil((mainDays.value + offDays.value) / 30) * softwareCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
        {
            label: t('rentCalculator.repair'),
            value: useExactMonths.value
                ? `${houseCount.value} × (${mainMonthFactor.value} + ${offMonthFactor.value}) × ${repairCost.value} € = ${(houseCount.value * (mainMonthFactor.value + offMonthFactor.value) * repairCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`
                : `${houseCount.value} × ${Math.ceil((mainDays.value + offDays.value) / 30)} × ${repairCost.value} € = ${(houseCount.value * Math.ceil((mainDays.value + offDays.value) / 30) * repairCost.value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
        },
    ])

    // Methoden (z.B. für Save/Load)
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
            licenceFee: licenceFee.value,
            ownerTaxRate: ownerTaxRate.value,
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
        if (typeof state.licenceFee === 'number') licenceFee.value = state.licenceFee
        if (typeof state.ownerTaxRate === 'number') ownerTaxRate.value = state.ownerTaxRate
    }

    // Save/Load/Delete
    const savedEntries = ref([])
    const selectedEntry = ref(null)
    const saveName = ref('')

    function saveEntry() {
        const entry = getCurrentState()
        entry.name = saveName.value
        let entries = JSON.parse(localStorage.getItem('rentCalcEntries') || '[]')
        entries = entries.filter((e) => e.name !== entry.name)
        entries.push(entry)
        localStorage.setItem('rentCalcEntries', JSON.stringify(entries))
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
        gasCost.value = 20
        powerCost.value = 50
        softwareCost.value = 10
        repairCost.value = 30
        licenceFee.value = 30
        ownerTaxRate.value = 25

        // Setze auch alle anderen Store-Ausgangswerte explizit zurück
        houseCount.value = 1
        mainDays.value = 150
        offDays.value = 215
        mainOccupancy.value = 100
        offOccupancy.value = 70
        mainCalcType.value = 'bed'
        offCalcType.value = 'month'
        mainRooms.value = 2
        roomPrice.value = 75
        bedPrice.value = 45
        housePrice.value = 120
        monthlyPrice.value = 750
        beds.value = 3
        mainCleanings.value = 50
        offCleanings.value = 5
        useExactMonths.value = true
    }

    onMounted(loadEntries)

    // Export alles, was gebraucht wird
    return {
        // States
        mainDays,
        offDays,
        mainOccupancy,
        offOccupancy,
        mainCalcType,
        mainRooms,
        roomPrice,
        houseCount,
        bedPrice,
        housePrice,
        monthlyPrice,
        beds,
        mainCleanings,
        offCleanings,
        cleaningCost,
        tax,
        gasCost,
        powerCost,
        softwareCost,
        repairCost,
        offCalcType,
        licenceFee,
        useExactMonths,
        ownerTaxRate,
        // Computeds
        mainMonthFactor,
        offMonthFactor,
        mainRevenueFull,
        mainRevenue,
        mainCosts,
        mainProfit,
        offRevenueFull,
        offRevenue,
        offCosts,
        offTax,
        offProfit,
        totalRevenue,
        totalCosts,
        totalTax,
        totalProfit,
        mainRuleLicenceFee,
        mainRuleIncome,
        mainRuleTax,
        mainRuleNetto,
        offRuleLicenceFee,
        offRuleIncome,
        offRuleTax,
        offRuleNetto,
        totalRuleLicenceFee,
        totalRuleIncome,
        totalRuleTax,
        totalRuleNetto,
        mainCostDetailsItems,
        offCostDetailsItems,
        totalCostDetailsItems,
        // Methoden
        getCurrentState,
        setState,
        saveEntry,
        loadEntries,
        loadEntry,
        deleteEntry,
        resetCosts,
        // Save/Load
        savedEntries,
        selectedEntry,
        saveName,
    }
})
