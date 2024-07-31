<template>
    <div>
        <q-card style="width: 100%; margin-bottom: 0.1rem;" stretch>
            <q-card-section >
                <div class="Inline Flex row wrap justify-between items-center">
                <div class="text-6 text-grey-9 ">{{ bank.AcctNum }}</div>
                <div class="flex row items-center">
                <div class="text-6 text-grey-9 q-ma-sm">{{ bank.balance}} р.</div>
                <div class="q-pa-sm q-gutter-sm">
                    <div class="flex" style="gap: 0.5rem;">
                <AccountEdit/>
                <q-btn square round color="red" icon="delete" @click="store.deleteAcct(bank.id)"/>
            </div>
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
import AccountEdit from './AccountEdit.vue';

export default {
    components: { AccountEdit},
    props: ['bank'],
  setup() {
    const store = useBankStore();
    return {store}
  },
 
} 
</script>