
<template>
  <main class="flex justify-center" style="gap: 1rem">


  <div style="width: 49%;">
      <div class="Inline Flex row items-baseline justify-center" style=" margin-right: 3rem; margin-left: 3rem">
          <h5>Банковские Счета</h5>
          <DatePicker/>
          <AccountForm/>
        </div>
      <div v-for="bank in store.Acct" :key="bank">
        <AccountDetails :bank="bank"/>
      </div>
    </div>
    <div style="width: 49%; ">
        <div class="Inline Flex row items-baseline justify-center">
          <h5 style="margin-bottom: 3.2rem;">Операции по счету</h5>
        </div>
          <AccountTransaction/>
        
    </div>

  </main>
</template>


<script>
import AccountDetails from 'src/components/AccountDetails.vue';
import { useBankStore } from 'stores/bankStore';
import DatePicker from 'src/components/DatePicker.vue';
import AccountForm from 'src/components/AccountForm.vue';
import AccountTransaction from 'src/components/AccountTransaction.vue';


  export default {
    components: {AccountDetails, DatePicker, AccountForm, AccountTransaction},
    setup() {
      const store = useBankStore();
      return {store}
    },
   
  } 
</script>