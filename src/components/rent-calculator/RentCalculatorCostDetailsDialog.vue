<template>
    <q-dialog v-model="localModelValue">
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">{{ title }}</div>
                <q-list dense>
                    <q-item v-for="(item, idx) in items" :key="idx">
                        <q-item-section>{{ item.label }}</q-item-section>
                        <q-item-section side>{{ item.value }}</q-item-section>
                    </q-item>
                    <div class="text-right">
                        <q-btn
                            flat
                            color="primary"
                            :label="$t('rentCalculator.close')"
                            @click="close"
                            v-close-popup
                        />
                    </div>
                </q-list>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
    modelValue: Boolean,
    title: String,
    items: Array,
})
const emit = defineEmits(['update:modelValue'])

const localModelValue = ref(props.modelValue)
watch(
    () => props.modelValue,
    (val) => (localModelValue.value = val),
)
watch(localModelValue, (val) => emit('update:modelValue', val))

function close() {
    emit('update:modelValue', false)
}
</script>
