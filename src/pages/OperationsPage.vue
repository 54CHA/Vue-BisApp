<script setup></script>

<template>
  <main class="flex justify-center" style="gap: 1rem">
    <div style="width: 49%">
      <div class="Inline Flex row items-baseline justify-between">
        <h5>Список операций</h5>
        <q-btn
          color="primary"
          icon="add"
          label="Добавить операцию"
          @click="openNewTransactionDialog"
          class="q-ml-md custom-btn"
        />
      </div>
      <q-list>
        <q-item
          v-for="transaction in store.transactions"
          :key="transaction.id"
          clickable
          v-ripple
          @click="selectTransaction(transaction)"
          :class="{
            'selected-transaction':
              selectedTransaction && selectedTransaction.id === transaction.id,
          }"
        >
          <q-item-section>
            <div class="row items-center" style="gap: 10%">
              <q-item-label
                class="text-h7"
                style="font-size: 14px; color: #757575"
                >{{ formatDate(transaction.date) }}</q-item-label
              >
              <q-item-label
                class="text-h6"
                style="font-size: 14px; color: #757575"
              >
                <div class="q-mt-sm">От: {{ transaction.fromAcct }}</div>
                <div>Кому: {{ transaction.toAcct }}</div>
              </q-item-label>
            </div>
          </q-item-section>
          <q-item-section side class="text-h6" style="font-size: 14px">
            {{ formatAmount(transaction.amount) }} р.
          </q-item-section>
          <q-item-section side>
            <div class="row items-center">
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                class="custom-icon-btn"
                @click.stop="openEditTransactionDialog(transaction)"
              >
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                class="custom-icon-btn"
                @click.stop="confirmDeleteTransaction(transaction.id)"
              >
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div style="width: 49%">
      <h5 style="margin-left: 1rem">Детали операции</h5>
      <div v-if="selectedTransaction">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Остаток баланса</div>
            <q-list>
              <q-item-section>
                <div class="Inline Flex row items-baseline justify-between">
                  <q-item-label class="text-h6 q-mb-sm" style="font-size: 14px"
                    >От: {{ selectedTransaction.fromAcct }}</q-item-label
                  >
                  <q-item-label
                    class="text-h6"
                    style="font-size: 14px; color: #757575"
                    >{{
                      getBalanceAfterTransaction(selectedTransaction.fromAcct)
                    }}
                    р.</q-item-label
                  >
                </div>
              </q-item-section>
              <q-item-section>
                <div class="Inline Flex row items-baseline justify-between">
                  <q-item-label
                    class="text-h6"
                    style="font-size: 14px; margin-left: -6px"
                    >Кому: {{ selectedTransaction.toAcct }}</q-item-label
                  >
                  <q-item-label
                    class="text-h6"
                    style="font-size: 14px; color: #757575"
                    >{{
                      getBalanceAfterTransaction(selectedTransaction.toAcct)
                    }}
                    р.</q-item-label
                  >
                </div>
              </q-item-section>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Edit Transaction Dialog -->
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
                <q-btn
                  label="Изменить операцию"
                  type="submit"
                  color="primary"
                />
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

    <!-- New Transaction Dialog -->
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
              <q-btn label="Добавить операцию" type="submit" color="primary" />
              <q-btn
                label="Отмена"
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
  </main>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useBankStore } from "stores/bankStore";
import { useQuasar } from "quasar";

export default {
  setup() {
    const store = useBankStore();
    const $q = useQuasar();
    const selectedTransaction = ref(null);
    const editTransactionDialog = ref(false);
    const editedTransaction = ref({
      id: null,
      fromAcct: "",
      toAcct: "",
      amount: 0,
    });

    const accountOptions = computed(() => {
      return store.Acct.map((account) => ({
        label: account.AcctNum,
        value: account.AcctNum,
      }));
    });

    const selectTransaction = (transaction) => {
      selectedTransaction.value = transaction;
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
        store.editTransaction(editedTransaction.value);
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
      try {
        store.deleteTransaction(id);
        $q.notify({
          color: "negative",
          message: "Операция успешно удалена",
          icon: "check",
        });
      } catch (error) {
        console.error("Ошибка удаления операции:", error);
        $q.notify({
          color: "negative",
          message: "Ошибка удаления операции",
          icon: "report_problem",
        });
      }
    };

    const getBalanceAfterTransaction = (accountNum) => {
      if (!selectedTransaction.value) return "N/A";

      const transactionDate = new Date(selectedTransaction.value.date);
      const transactionTime = transactionDate.getTime();

      const relevantTransactions = store.transactions
        .filter(
          (t) =>
            (t.fromAcct === accountNum || t.toAcct === accountNum) &&
            new Date(t.date).getTime() <= transactionTime
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const selectedIndex = relevantTransactions.findIndex(
        (t) => t.id === selectedTransaction.value.id
      );

      let balance =
        store.Acct.find((a) => a.AcctNum === accountNum)?.initialBalance || 0;
      for (let i = 0; i <= selectedIndex; i++) {
        const t = relevantTransactions[i];
        if (t.fromAcct === accountNum) {
          balance -= t.amount;
        } else if (t.toAcct === accountNum) {
          balance += t.amount;
        }
      }

      return balance.toFixed(2);
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", options);
    };

    onMounted(() => {
      if (store.transactions.length > 0) {
        selectTransaction(store.transactions[0]);
      }
    });

    const newTransactionDialog = ref(false);
    const newTransaction = ref({
      fromAcct: "",
      toAcct: "",
      amount: 0,
      date: "",
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

        const localDate = new Date(newTransaction.value.date);
        const utcDate = new Date(
          localDate.getTime() - localDate.getTimezoneOffset() * 60000
        );

        store.addTransaction({
          ...newTransaction.value,
          date: utcDate.toISOString().split("T")[0],
        });

        newTransactionDialog.value = false;
        $q.notify({
          color: "positive",
          message: "Операция успешно добавлена  ",
          icon: "check",
        });

        newTransaction.value = {
          fromAcct: "",
          toAcct: "",
          amount: 0,
          date: "",
        };
      } catch (error) {
        console.error("Ошибка добавления операции:", error);
        $q.notify({
          color: "negative",
          message: error.message || "Ошибка добавления операции",
          icon: "report_problem",
        });
      }
    };

    const formatAmount = (amount) => {
      return Number(amount).toFixed(2);
    };

    return {
      store,
      selectedTransaction,
      selectTransaction,
      openEditTransactionDialog,
      editTransaction,
      confirmDeleteTransaction,
      deleteTransaction,
      getBalanceAfterTransaction,
      formatDate,
      editTransactionDialog,
      editedTransaction,
      accountOptions,
      newTransactionDialog,
      newTransaction,
      openNewTransactionDialog,
      addNewTransaction,
      formatAmount,
    };
  },
};
</script>

<style scoped>
.custom-icon-btn {
  font-size: 18px;
}

.q-item {
  transition: background-color 0.3s;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 4px;
}

.q-item:hover {
  background-color: #f0f0f0;
}

.selected-transaction {
  background-color: #e0e0e0;
}

.custom-icon-btn ::v-deep .q-icon {
  font-size: 31px;
}

.custom-btn {
  transition: background-color 0.3s, color 0.3s;
}
</style>
