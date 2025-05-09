<template>
    <q-layout view="hHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

                <q-toolbar-title class="q-mr-auto">{{ $t('nav.appName') }}</q-toolbar-title>

                <q-select
                    v-model="locale"
                    :options="langOptions"
                    emit-value
                    map-options
                    dense
                    outlined
                    options-dense
                    style="width: 120px"
                    class="q-ml-md"
                    @update:model-value="setLang"
                >
                    <template v-slot:option="scope">
                        <q-item
                            v-bind="scope.itemProps"
                            v-on="scope.itemEvents"
                            class="row items-center"
                        >
                            <span class="q-mr-sm">{{ scope.opt.icon }}</span>
                            {{ scope.opt.label }}
                        </q-item>
                    </template>
                </q-select>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
            <q-list>
                <q-item clickable tag="router-link" to="/rent-calculator">
                    <q-item-section avatar>
                        <q-icon name="calculate" color="primary" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="text-primary">{{
                            $t('nav.rentCalculator')
                        }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const leftDrawerOpen = ref(false)
const { locale } = useI18n()
const langOptions = [
    { label: 'Deutsch', value: 'de-DE', icon: '🇩🇪' },
    { label: 'English', value: 'en-US', icon: '🇬🇧' },
    { label: 'Nederlands', value: 'nl-NL', icon: '🇳🇱' },
]

onMounted(() => {
    const storedLang = localStorage.getItem('lang')
    if (storedLang && langOptions.some((opt) => opt.value === storedLang)) {
        locale.value = storedLang
    }
})

function setLang(val) {
    locale.value = val
    localStorage.setItem('lang', val)
}

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
