<template>
  <div>
    <div class="q-mb-md Inline Flex row items-baseline justify-between">
      <h5 style="margin-left: 1rem">Операции по счету</h5>
      <q-btn
        color="primary"
        icon="add"
        label="Добавить операцию"
        @click="openNewTransactionDialog"
      />
    </div>

    <q-list>
      <q-item
        v-for="transaction in displayedTransactions"
        :key="transaction.id"
        class="q-mb-sm"
      >
        <q-item-section>
          <div class="row items-center" style="max-width: 40%">
            <div class="q-mr-md" style="flex-grow: 1">
              <q-item-label class="text-h6" style="font-size: 14px">
                От: {{ transaction.fromAcct }}
              </q-item-label>
              <q-item-label class="text-h6" style="font-size: 14px">
                Кому: {{ transaction.toAcct }}
              </q-item-label>
            </div>
            <q-item-label >{{ formatDate(transaction.date) }}</q-item-label>
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="text-h6" style="font-size: 14px">
            {{ formatAmount(transaction.amount) }} р.
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="openEditTransactionDialog(transaction)"
              style="font-size: 18px"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click.stop="confirmDeleteTransaction(transaction.id)"
              style="font-size: 18px"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="newTransactionDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Добавить операцию</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="addNewTransaction" class="q-gutter-md">
            <q-select
              filled
              v-model="newTransaction.fromAcct"
              :options="accountOptions"
              label="Дебетовый счет"
              emit-value
              map-options
            />
            <q-select
              filled
              v-model="newTransaction.toAcct"
              :options="accountOptions"
              label="Кредитовый счет"
              emit-value
              map-options
            />
            <q-input
              filled
              type="number"
              v-model.number="newTransaction.amount"
              label="Сумма"
            />
            <q-input
              filled
              v-model="newTransaction.date"
              mask="date"
              :rules="['date']"
              label="Дата операции"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="newTransaction.date">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Закрыть"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <div>
              <q-btn label="Add Transaction" type="submit" color="primary" />
              <q-btn
                label="Закрыть"
                v-close-popup
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editTransactionDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Изменить операцию</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="editTransaction" class="q-gutter-md">
            <q-select
              filled
              v-model="editedTransaction.fromAcct"
              :options="accountOptions"
              label="Дебетовый счет"
              emit-value
              map-options
            />
            <q-select
              filled
              v-model="editedTransaction.toAcct"
              :options="accountOptions"
              label="Кредитовый счет"
              emit-value
              map-options
            />
            <q-input
              filled
              type="number"
              v-model.number="editedTransaction.amount"
              label="Сумма"
            />
            <div>
              <q-btn label="Изменить операцию" type="submit" color="primary" />
              <q-btn
                label="Закрыть"
                v-close-popup
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useBankStore } from "stores/bankStore";

export default {
  setup() {
    const $q = useQuasar();
    const store = useBankStore();
    const newTransactionDialog = ref(false);
    const editTransactionDialog = ref(false);
    const newTransaction = ref({
      fromAcct: "",
      toAcct: "",
      amount: 0,
      date: "",
    });
    const editedTransaction = ref({
      id: null,
      fromAcct: "",
      toAcct: "",
      amount: 0,
      date: "",
    });

    const accountOptions = computed(() => {
      return store.Acct.map((account) => ({
        label: account.AcctNum,
        value: account.AcctNum,
      }));
    });

    const displayedTransactions = computed(() => {
      if (store.selectedAccount) {
        return store.transactions.filter(
          (t) =>
            t.fromAcct === store.selectedAccount ||
            t.toAcct === store.selectedAccount
        );
      }
      return store.filteredTransactions;
    });

    const openNewTransactionDialog = () => {
      newTransaction.value = {
        fromAcct: "",
        toAcct: "",
        amount: 0,
        date: "",
      };
      newTransactionDialog.value = true;
    };

    const addNewTransaction = () => {
      try {
        if (
          !newTransaction.value.fromAcct ||
          !newTransaction.value.toAcct ||
          !newTransaction.value.amount ||
          !newTransaction.value.date
        ) {
          throw new Error("Please fill in all fields");
        }
        store.addTransaction(newTransaction.value);
        newTransactionDialog.value = false;
        $q.notify({
          color: "positive",
          message: "Операция успешно добавлена",
          icon: "check",
        });
      } catch (error) {
        console.error("Ошибка добавления операции:", error);
        $q.notify({
          color: "negative",
          message: error.message || "Ошибка добавления операции",
          icon: "report_problem",
        });
      }
    };

    const openEditTransactionDialog = (transaction) => {
      editedTransaction.value = { ...transaction };
      editTransactionDialog.value = true;
    };

    const editTransaction = () => {
      try {
        if (
          !editedTransaction.value.fromAcct ||
          !editedTransaction.value.toAcct ||
          !editedTransaction.value.amount
        ) {
          throw new Error("Please fill in all fields");
        }
        // Don't include the date in the editedTransaction
        const { date, ...transactionToEdit } = editedTransaction.value;
        store.editTransaction(transactionToEdit);
        editTransactionDialog.value = false;
        $q.notify({
          color: "positive",
          message: "Операция успешно обновлена",
          icon: "check",
        });
      } catch (error) {
        console.error("Ошибка обновления операции:", error);
        $q.notify({
          color: "negative",
          message: error.message || "Ошибка обновления операции",
          icon: "report_problem",
        });
      }
    };

    const confirmDeleteTransaction = (id) => {
      $q.dialog({
        title: "Подтвердите удаление",
        message: "Вы уверены, что хотите удалить эту транзакцию?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        deleteTransaction(id);
      });
    };

    const deleteTransaction = (id) => {
      store.deleteTransaction(id);
      $q.notify({
        color: "negative",
        message: "Транзакция успешно удалена",
        icon: "delete",
      });
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", options);
    };

    const formatAmount = (amount) => {
      return Number(amount).toFixed(2);
    };

    return {
      $q,
      store,
      deleteTransaction,
      newTransactionDialog,
      newTransaction,
      accountOptions,
      openNewTransactionDialog,
      addNewTransaction,
      displayedTransactions,
      editTransactionDialog,
      editedTransaction,
      openEditTransactionDialog,
      editTransaction,
      confirmDeleteTransaction,
      formatDate,
      formatAmount,
    };
  },
};
</script>

<style scoped>
.q-item {
  transition: background-color 0.3s;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: -0.2rem;
}
.q-item:hover {
  background-color: #f0f0f0;
}
</style>
