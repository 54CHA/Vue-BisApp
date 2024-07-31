<template>
     <div class="q-pa-md flex row items-center" style="max-width: 400px">
        <div class="cursor-pointer">
           <q-btn name="add" color="primary" icon-right="add" label="Добавить Аккаунт"> 
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
<q-form
  @submit="onSubmit"
  @reset="onReset"
  class="q-gutter-md"
>
  <q-input
    filled
    v-model="newAcct"
    label="Наименование счета"
  />
  <q-input
    filled
    type="number"
    v-model="newBalance"
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

</div>

<!-- <div><form @submit.prevent="onSubmit">
    <input type="text"
    placeholder="I need to..."
    v-model="newAcct">
    <button>Add</button>
   </form></div> -->
 </template>
 
 <script>
import { useBankStore } from 'stores/bankStore';
import { ref } from 'vue';

     export default {
        setup() {
      const store = useBankStore();

      const newAcct = ref('')
      const newBalance = ref('')

const onSubmit = () => {
    if (newAcct.value.length > 0){
        store.addAcct({
            id: Math.floor(Math.random() * 10000),
            AcctNum: newAcct.value,
            balance: newBalance.value,
        })
        newAcct.value = ''
        newBalance.value = ''
    }
}
return {onSubmit, newAcct, newBalance, store}

    },
     }
 </script> 