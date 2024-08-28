<template>
  <div class="account-item q-mb-sm">
    <q-btn
      flat
      class="full-width account-btn custom-btn"
      :class="{ 'selected-account': isSelected }"
      @click="selectAccount"
    >
      <q-item class="full-width">
        <q-item-section side>
          <q-item-label class="text-subtitle1">{{ bank.AcctNum }}</q-item-label>
        </q-item-section>
        <q-item-section />
        <q-item-section side class="balance-section">
          <q-item-label class="balance-label">
            {{ formatAmount(currentBalance) }} р.
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row items-center">
            <q-btn
              flat
              dense
              round
              color="primary"
              icon="edit"
              class="custom-icon-btn"
              @click.stop="openEditDialog"
            >
            </q-btn>
            <q-btn
              flat
              dense
              round
              color="negative"
              icon="delete"
              class="custom-icon-btn"
              @click.stop="confirmDeleteAccount"
            >
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-btn>

    <q-dialog v-model="editDialogOpen">
      <q-card style="min-width: 350px">
        <AccountEdit :account="bank" @close="closeEditDialog" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useBankStore } from "stores/bankStore";
import AccountEdit from "./AccountEdit.vue";
import { useQuasar } from "quasar";

export default {
  components: { AccountEdit },
  props: ["bank"],
  emits: ["account-deleted"],
  setup(props, { emit }) {
    const store = useBankStore();
    const $q = useQuasar();
    const editDialogOpen = ref(false);

    const currentBalance = computed(() => {
      return (
        store.accountBalances[props.bank.AcctNum] || props.bank.initialBalance
      );
    });

    const selectAccount = () => {
      store.setSelectedAccount(props.bank.AcctNum);
    };

    const isSelected = computed(() => {
      return store.selectedAccount === props.bank.AcctNum;
    });

    const openEditDialog = () => {
      editDialogOpen.value = true;
    };

    const closeEditDialog = () => {
      editDialogOpen.value = false;
    };

    const confirmDeleteAccount = () => {
      $q.dialog({
        title: "Подтвердите удаление",
        message: `Вы уверены, что хотите удалить счет ${props.bank.AcctNum}?`,
        cancel: true,
        persistent: true,
      }).onOk(() => {
        deleteAccount();
      });
    };

    const deleteAccount = () => {
      store.deleteAcct(props.bank.id);
      $q.notify({
        color: "negative",
        message: `Счет ${props.bank.AcctNum} успешно удален`,
        icon: "delete",
      });

      emit("account-deleted");
    };

    const formatAmount = (amount) => {
      return Number(amount).toFixed(2);
    };

    return {
      store,
      currentBalance,
      selectAccount,
      isSelected,
      confirmDeleteAccount,
      deleteAccount,
      editDialogOpen,
      openEditDialog,
      closeEditDialog,
      formatAmount,
    };
  },
};
</script>

<style scoped>
.account-btn {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.account-btn:hover {
  background-color: #f0f0f0;
}

.account-btn:active {
  background-color: #e0e0e0; /* This is the click color, adjust as needed */
}

.selected-account {
  background-color: #e0e0e0;
}

.custom-btn {
  font-size: 18px;
  font-weight: 500;
}

.custom-icon-btn {
  font-size: 18px;
}

.account-item {
  margin-bottom: 4px;
}

.balance-label {
  text-transform: none;
  font-size: 14px
}

.balance-section {
  padding-right: 16px;
}
</style>
