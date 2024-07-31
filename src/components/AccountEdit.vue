<template>
        <div class="cursor-pointer">
           <q-btn name="edit" square color="blue" round icon="edit"> 
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
<q-form
  @submit="onSubmit"
  class="q-gutter-md"
>
  <q-input
    filled
    v-model="upAcct"
    label="Наименование счета"
  />
  <q-input
    filled
    type="number"
    v-model="upBalance"
    label="Баланс"
  />
  <div>
    <q-btn label="Добавить" type="submit" color="primary"/>
    <q-btn label="Отмена" clickable v-close-popup color="primary" flat class="q-ml-sm" />
  </div>
</q-form>
</q-popup-proxy>
</q-btn>
</div> 

 </template>

 <script>
import { useBankStore } from 'stores/bankStore';
import { ref } from 'vue';

     export default {
        setup() {
      const store = useBankStore();

      const upAcct = ref('')
      const upBalance = ref('')

const onSubmit = () => {

  // EDIT NOT WORKING

  store.$patch((state) => {
  state.Acct.push({ AcctNum: upAcct, balance: upBalance })
  state.hasChanged = true
})

}
return {onSubmit, upAcct, upBalance, store,}

    },
     }
 </script> 