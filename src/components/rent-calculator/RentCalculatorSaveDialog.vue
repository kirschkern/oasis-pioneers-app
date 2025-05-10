<template>
    <q-dialog v-model="localModelValue">
        <q-card>
            <q-card-section>
                <div class="text-h6">{{ $t('rentCalculator.saveCalculation') }}</div>
                <q-input
                    v-model="localSaveName"
                    :label="$t('rentCalculator.name')"
                    autofocus
                    @keyup.enter="emitSave"
                />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="$t('rentCalculator.cancel')"
                    @click="emitCancel"
                    v-close-popup
                />
                <q-btn
                    color="primary"
                    :label="$t('rentCalculator.save')"
                    @click="emitSave"
                    :disable="disableSave"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
    modelValue: Boolean,
    saveName: String,
    disableSave: Boolean,
})
const emit = defineEmits(['update:modelValue', 'update:saveName', 'save', 'cancel'])

const localModelValue = ref(props.modelValue)
watch(
    () => props.modelValue,
    (val) => (localModelValue.value = val),
)
watch(localModelValue, (val) => emit('update:modelValue', val))

const localSaveName = ref(props.saveName)
watch(
    () => props.saveName,
    (val) => (localSaveName.value = val),
)
watch(localSaveName, (val) => emit('update:saveName', val))

function emitSave() {
    emit('save')
    emit('update:modelValue', false)
}
function emitCancel() {
    emit('cancel')
    emit('update:modelValue', false)
}
</script>
