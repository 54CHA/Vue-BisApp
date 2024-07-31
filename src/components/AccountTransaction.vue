<template>
  <div>
        <q-card>
            <q-card-section>
                <div class="Inline Flex row wrap justify-between items-center ">
                <div class="text-6 text-grey-9 flex grow">DATE</div>
                <div class="text-6 text-grey-9 q-ma-sm">ACCOUNT 1 <br> ACCOUNT 2</div>
                <div class="flex row items-center">
                <div class="text-6 text-grey-9 q-ma-sm">AMOUNT р.</div>
                <div class="q-pa-sm q-gutter-sm">
                    <div class="flex" style="gap: 0.5rem;">
                        <q-btn name="edit" square color="blue" round icon="edit"/> 
                <q-btn square color="red" round icon="delete"/>
            </div>
            </div>
                </div>
            </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>

 import { useBankStore } from 'stores/bankStore';
    export default {
        setup() {
        const store = useBankStore();
        return{store}
    }
    }
</script>