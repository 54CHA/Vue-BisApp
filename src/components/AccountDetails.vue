<template>
    <div>
        <q-card>
            <q-card-section>
                <div class="Inline Flex row wrap justify-between items-center">
                <div class="text-6 text-grey-9 flex grow">{{ bank.AcctNum }}</div>
                <div class="flex row items-center">
                <div class="text-6 text-grey-9">{{ bank.balance}} р.</div>
                <div class="q-pa-md q-gutter-sm">
                <q-btn square color="blue" round icon="edit"/>
                <q-btn square color="red" round icon="delete" @click="store.deleteAcct(bank.id)"/>
            </div>
                </div>
            </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
   import { store } from 'quasar/wrappers';
import { useBankStore } from 'stores/bankStore';

export default {
    props: ['bank'],
  setup() {
    const store = useBankStore();
    return {store}
  },
 
} 
</script>