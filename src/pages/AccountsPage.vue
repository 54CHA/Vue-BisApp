
<template>
  <main>
<q-splitter
      v-model="splitterModel"
      style="height: 400px"
    >

    <template v-slot:before>
      <div class="Inline Flex row items-baseline justify-center">
          <h5>Банковские Счета</h5>
          <DatePicker/>
          <AccountForm/>
        </div>
      <div v-for="bank in store.Acct" :key="bank">
        <AccountDetails :bank="bank"/>
      </div>
    </template>

    <template v-slot:after>
        <div class="Inline Flex row items-baseline justify-center">
          <h5>Операции по счету</h5>
          
        </div>
      </template>
    </q-splitter>
  </main>
</template>


<!-- <div v-for="task in taskStore.tasks">
  <TaskDetails :task="task"/>
</div>
 -->

<script>
import AccountDetails from 'src/components/AccountDetails.vue';
import { useBankStore } from 'stores/bankStore';
import DatePicker from 'src/components/DatePicker.vue';
import AccountForm from 'src/components/AccountForm.vue';


  export default {
    components: {AccountDetails, DatePicker, AccountForm},
    setup() {
      const store = useBankStore();
      return {store}
    },
   
  } 
</script>