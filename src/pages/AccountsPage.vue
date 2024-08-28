<template>
  <main class="flex justify-center" style="gap: 1rem">
    <div style="width: 49%">
      <div class="Inline Flex row items-baseline justify-between">
        <h5>Банковские Счета</h5>
        <DatePicker />
        <AccountForm />
      </div>
      <div v-for="bank in store.filteredAccounts" :key="bank.id">
        <AccountDetails :bank="bank" />
      </div>
    </div>
    <div style="width: 49%">
      <AccountTransaction />
    </div>
  </main>
</template>

<script>
import { onMounted } from "vue";
import { useBankStore } from "stores/bankStore";
import AccountDetails from "components/AccountDetails.vue";
import DatePicker from "components/DatePicker.vue";
import AccountForm from "components/AccountForm.vue";
import AccountTransaction from "components/AccountTransaction.vue";

export default {
  components: { AccountDetails, DatePicker, AccountForm, AccountTransaction },
  setup() {
    const store = useBankStore();

    onMounted(() => {
      store.selectFirstAccount();
    });

    return { store };
  },
};
</script>
